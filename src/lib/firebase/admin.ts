import "server-only";

// Configuration boundary only; Admin SDK and ADC initialization belong to G2.
export function getFirebaseServerConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Thiếu FIREBASE_PROJECT_ID ở môi trường server.");
  }
  return { projectId };
}
