import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Task Calendar/);
  });

  test("should navigate to calendar", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/calendar"]');
    await expect(page).toHaveURL(/calendar/);
  });

  test("should navigate to tasks", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/tasks"]');
    await expect(page).toHaveURL(/tasks/);
  });

  test("should navigate to categories", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/categories"]');
    await expect(page).toHaveURL(/categories/);
  });

  test("should navigate to goals", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/goals"]');
    await expect(page).toHaveURL(/goals/);
  });

  test("should navigate to settings", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/settings"]');
    await expect(page).toHaveURL(/settings/);
  });
});
