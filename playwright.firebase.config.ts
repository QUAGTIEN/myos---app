import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "firebase.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3101",
    trace: "retain-on-failure",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next start --port 3101",
    url: "http://127.0.0.1:3101/login",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
