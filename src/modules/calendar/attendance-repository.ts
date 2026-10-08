"use client";

import { z } from "zod";
import { openLocalDatabase } from "@/lib/local-database";
import {
  announceRepositorySave,
  useRepositoryData,
} from "@/lib/repository-cache";
import { cloudRead, cloudWrite } from "@/lib/firebase/cloud-client";
import {
  activitySchema,
  attendanceId,
  attendanceMonthSchema,
  type AttendanceActivity,
  type AttendanceMonth,
} from "./attendance-model";

type Kind = "attendanceActivities" | "attendanceMonths";
const cloud = process.env.NEXT_PUBLIC_MYOS_MODE !== "local";
export const attendanceRepository = {
  async activities(): Promise<AttendanceActivity[]> {
    if (cloud)
      return activitySchema
        .array()
        .parse(await cloudRead("attendanceActivities"));
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const request = db
        .transaction("attendanceActivities")
        .objectStore("attendanceActivities")
        .getAll();
      request.onsuccess = () => {
        try {
          resolve(activitySchema.array().parse(request.result));
        } catch (cause) {
          reject(cause);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  async month(id: string): Promise<AttendanceMonth | null> {
    attendanceId.parse(id);
    if (cloud)
      return attendanceMonthSchema
        .nullable()
        .parse(await cloudRead("attendanceMonths", id));
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const request = db
        .transaction("attendanceMonths")
        .objectStore("attendanceMonths")
        .get(id);
      request.onsuccess = () => {
        try {
          resolve(
            attendanceMonthSchema.nullable().parse(request.result ?? null),
          );
        } catch (cause) {
          reject(cause);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  async save(
    kind: Kind,
    value: AttendanceActivity | AttendanceMonth,
    expectedVersion: number,
  ) {
    const schema =
      kind === "attendanceActivities" ? activitySchema : attendanceMonthSchema;
    const input = schema.parse(value);
    if (input.version !== expectedVersion + 1)
      throw new Error("Sai phiên bản chấm công.");
    if (cloud)
      return schema.parse(
        await cloudWrite({
          kind,
          operation: "save",
          id: input.id,
          expectedVersion,
          value: input,
        }),
      );
    const db = await openLocalDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        ["attendanceActivities", "attendanceMonths"],
        "readwrite",
      );
      const store = tx.objectStore(kind);
      let failure: unknown;
      const request = store.get(input.id);
      request.onsuccess = () => {
        if ((request.result?.version ?? 0) !== expectedVersion) {
          failure = new Error(
            "Dữ liệu đã thay đổi ở tab khác. Bản nháp vẫn được giữ; tải bản mới trước khi lưu.",
          );
          tx.abort();
          return;
        }
        const verify =
          kind === "attendanceMonths"
            ? tx
                .objectStore("attendanceActivities")
                .get((input as AttendanceMonth).activityId)
            : store.count();
        verify.onsuccess = () => {
          if (
            (kind === "attendanceMonths" && !verify.result) ||
            (kind === "attendanceActivities" &&
              !expectedVersion &&
              verify.result >= 50)
          ) {
            failure = new Error(
              kind === "attendanceMonths"
                ? "Công việc không còn khả dụng."
                : "Tối đa 50 loại công việc.",
            );
            tx.abort();
          } else store.put(input);
        };
      };
      tx.oncomplete = () => resolve();
      tx.onabort = tx.onerror = () =>
        reject(
          failure ??
            tx.error ??
            new Error("Không lưu được chấm công. Bản nháp vẫn được giữ."),
        );
    });
    announceRepositorySave({ kind, id: input.id, value: input });
    return input;
  },
};

export function useAttendanceActivities() {
  return useRepositoryData(
    "attendanceActivities",
    undefined,
    attendanceRepository.activities,
  );
}
export function useAttendanceMonth(id: string) {
  z.string().min(1).parse(id);
  return useRepositoryData("attendanceMonths", id, () =>
    attendanceRepository.month(id),
  );
}
