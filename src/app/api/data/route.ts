import { NextRequest, NextResponse } from "next/server";
import {
  readJson,
  apiError,
  authenticatedUser,
  cloudMode,
  HttpError,
  requireCsrf,
} from "@/lib/firebase/session";
import { kindSchema, readData, writeData } from "@/lib/firebase/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store, private" };

function requestTimings() {
  const started = performance.now();
  const stages: string[] = [];
  return {
    async measure<T>(
      name: "auth" | "read" | "write",
      operation: () => Promise<T>,
    ) {
      const before = performance.now();
      try {
        return await operation();
      } finally {
        stages.push(`${name};dur=${(performance.now() - before).toFixed(1)}`);
      }
    },
    finish(response: NextResponse) {
      // Durations only: no user identifiers, queries, contents or credentials.
      response.headers.set(
        "Server-Timing",
        [
          ...stages,
          `total;dur=${(performance.now() - started).toFixed(1)}`,
        ].join(", "),
      );
      response.headers.set("Cache-Control", noStore["Cache-Control"]);
      return response;
    },
  };
}
export async function GET(request: NextRequest) {
  const timing = requestTimings();
  try {
    if (!cloudMode()) throw new HttpError(404, "Đang ở chế độ local.");
    const user = await timing.measure("auth", () => authenticatedUser());
    const kind = kindSchema.parse(request.nextUrl.searchParams.get("kind"));
    const id = request.nextUrl.searchParams.get("id") ?? undefined;
    return timing.finish(
      NextResponse.json(
        { value: await timing.measure("read", () => readData(user, kind, id)) },
        { headers: noStore },
      ),
    );
  } catch (cause) {
    const result = apiError(cause);
    return timing.finish(result);
  }
}
export async function POST(request: NextRequest) {
  const timing = requestTimings();
  try {
    if (!cloudMode()) throw new HttpError(404, "Đang ở chế độ local.");
    requireCsrf(request);
    const user = await timing.measure("auth", () => authenticatedUser());
    const payload = await readJson(request, 2 * 1024 * 1024);
    return timing.finish(
      NextResponse.json(
        {
          value: await timing.measure("write", () => writeData(user, payload)),
        },
        { headers: noStore },
      ),
    );
  } catch (cause) {
    const result = apiError(cause);
    return timing.finish(result);
  }
}
