import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "https://restful-booker.herokuapp.com";

export default defineConfig({
  testDir: "./tests/api",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});
