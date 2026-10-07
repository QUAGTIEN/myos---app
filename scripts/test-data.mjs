import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const cloud = process.argv[2] === "firebase";
const env = {
  ...process.env,
  NEXT_PUBLIC_MYOS_MODE: cloud ? "firebase" : "local",
};
if (cloud)
  Object.assign(env, {
    NEXT_PUBLIC_FIREBASE_API_KEY: "demo-key",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-myos.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-myos",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:123:web:demo",
    FIREBASE_PROJECT_ID: "demo-myos",
    NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL: "http://127.0.0.1:9099",
    FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
    FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
    APP_ORIGIN: "http://127.0.0.1:3101",
    FIREBASE_CLIENT_EMAIL: "",
    FIREBASE_PRIVATE_KEY: "",
    GOOGLE_APPLICATION_CREDENTIALS: "",
  });
if (cloud && process.platform === "win32") {
  // An 8.3 TEMP alias breaks Java AF_UNIX loopback on some Windows hosts.
  const javaTemp = resolve(".firebase", "java-tmp");
  mkdirSync(javaTemp, { recursive: true });
  env.JAVA_TOOL_OPTIONS =
    (env.JAVA_TOOL_OPTIONS || "") +
    ' -Djdk.net.unixdomain.tmpdir="' +
    javaTemp +
    '"';
}
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
function run(args) {
  const result = spawnSync(pnpm, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(["build"]);
if (cloud)
  run([
    "exec",
    "firebase",
    "emulators:exec",
    "--only",
    "auth,firestore",
    "--project",
    "demo-myos",
    process.platform === "win32"
      ? '"pnpm exec playwright test --config playwright.firebase.config.ts"'
      : "pnpm exec playwright test --config playwright.firebase.config.ts",
  ]);
else run(["test:e2e"]);
