import { expect, test } from "@playwright/test";

test.describe("theme", () => {
  test("follows the device when no choice is saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("uses the saved choice over the device setting", async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "qrious-theme", value: "light", url: baseURL! }]);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("the French page is marked as French", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });
});
