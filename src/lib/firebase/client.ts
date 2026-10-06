"use client";

// No SDK/network side effects in G1. The Firebase Web SDK will be connected in G2.
export function getFirebaseClientConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error(
      "Thiếu cấu hình Firebase. Kiểm tra .env.local trước khi dùng tính năng dữ liệu.",
    );
  }
  return config;
}
