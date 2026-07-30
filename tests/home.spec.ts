import { test, expect } from "@playwright/test";

const SECTIONS = ["why", "whatwedo", "process", "featured", "book", "findus"];

test("has semantic structure and one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("all key sections are present", async ({ page }) => {
  await page.goto("/");
  for (const id of SECTIONS) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  // scroll through so every section lays out
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 15));
    }
    window.scrollTo(0, 0);
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("booking widget renders", async ({ page }) => {
  await page.goto("/#book");
  await expect(page.getByText("Choose Your Date")).toBeVisible();
  await expect(page.getByText("Select a Time")).toBeVisible();
});

test("every image loads (no broken sources)", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 15));
    }
  });
  await page.waitForTimeout(400);
  const broken = await page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter(
        (i) => i.complete && i.naturalWidth === 0 && !i.src.endsWith(".svg"),
      ).length,
  );
  expect(broken).toBe(0);
});
