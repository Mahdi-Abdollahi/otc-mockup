import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Intercept the live-rate call so tests don't depend on real network/Binance
  await page.route("https://api.binance.com/**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ symbol: "USDCUSDT", price: "1.0000" }),
    });
  });
});

test("user can complete a full conversion", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("0.00").fill("100");
  // liveRate is now mocked and resolves fast, so this should already be enabled shortly after load
  await page.getByRole("button", { name: "Confirm" }).click();

  await expect(page.getByTestId("quote-result")).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Confirm" }).click();

  await expect(page.getByText("Trade completed")).toBeVisible({
    timeout: 10000,
  });
});

test("expired quote shows the expired panel", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("0.00").fill("100");
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByTestId("quote-result")).toBeVisible({ timeout: 5000 });

  await expect(page.getByText("Quote expired")).toBeVisible({ timeout: 20000 });
});
