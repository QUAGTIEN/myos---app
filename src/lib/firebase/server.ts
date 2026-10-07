import "server-only";

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export function adminApp() {
  const existing = getApps().find((app) => app.name === "myos-server");
  if (existing) return existing;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId || projectId !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    throw new Error(
      "Firebase project phía web và server chưa được cấu hình nhất quán.",
    );
  const authEmulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const firestoreEmulator = process.env.FIRESTORE_EMULATOR_HOST;
  if (authEmulator || firestoreEmulator) {
    if (
      !projectId.startsWith("demo-") ||
      !authEmulator ||
      !firestoreEmulator ||
      ![authEmulator, firestoreEmulator].every((host) =>
        /^(127\.0\.0\.1|localhost):\d+$/.test(host),
      )
    )
      throw new Error(
        "Cần cả Auth và Firestore Emulator trên project demo local.",
      );
    return initializeApp({ projectId }, "myos-server");
  }
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!!clientEmail !== !!privateKey)
    throw new Error("Cấu hình Firebase Admin chưa đầy đủ.");
  if (!clientEmail && !process.env.GOOGLE_APPLICATION_CREDENTIALS)
    throw new Error(
      "Chưa cấu hình Firebase Admin. Cần credentials server để đăng nhập và lưu dữ liệu cloud.",
    );
  return initializeApp(
    {
      projectId,
      credential:
        clientEmail && privateKey
          ? cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, "\n"),
            })
          : applicationDefault(),
    },
    "myos-server",
  );
}

export const adminAuth = () => getAuth(adminApp());
export const database = () => getFirestore(adminApp());
