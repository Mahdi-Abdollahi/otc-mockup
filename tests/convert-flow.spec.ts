// e2e/convert-flow.spec.ts
import { test, expect } from "@playwright/test";

test("user can complete a full conversion", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("0.00").fill("100");
  await page.getByRole("button", { name: "Confirm" }).click();

  // Quote screen — auto-waits past the mock's artificial delay
  await expect(page.getByTestId("quote-result")).toBeVisible({ timeout: 5000 });
  // Confirm the quote
  await page.getByRole("button", { name: "Confirm" }).click();

  // Settlement — auto-waits past the second mock delay
  await expect(page.getByText("Trade completed")).toBeVisible({
    timeout: 10000,
  });
});

test("expired quote shows the expired panel", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("0.00").fill("100");
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByTestId("quote-result")).toBeVisible({ timeout: 5000 });
  // Wait past the 15s quote validity window without confirming
  await expect(page.getByText("Quote expired")).toBeVisible({ timeout: 20000 });
});
