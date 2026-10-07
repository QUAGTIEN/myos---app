"use client";

import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

export const firebaseEnabled = process.env.NEXT_PUBLIC_MYOS_MODE !== "local";
let connected = false;

export function browserAuth() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  if (!config.apiKey || !config.projectId || !config.appId)
    throw new Error(
      "Chưa cấu hình Firebase Web SDK. Kiểm tra biến môi trường rồi khởi động lại ứng dụng.",
    );
  const app =
    getApps().find((item) => item.name === "myos-web") ??
    initializeApp(config, "myos-web");
  const auth = getAuth(app);
  const emulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL;
  if (emulator && !connected) {
    if (
      !config.projectId.startsWith("demo-") ||
      !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(emulator)
    )
      throw new Error("Emulator chỉ dùng với project demo và địa chỉ local.");
    connectAuthEmulator(auth, emulator, { disableWarnings: true });
    connected = true;
  }
  return auth;
}
