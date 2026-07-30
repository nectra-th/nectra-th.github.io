import { test, expect } from "@playwright/test";

const SECTIONS = ["top", "why", "pillars", "whatwedo", "process", "featured", "reviews", "brands", "book", "findus", "closing"];

test("has semantic structure and one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("all key sections are present with an accessible name", async ({ page }) => {
  await page.goto("/");
  for (const id of SECTIONS) {
    const section = page.locator(`#${id}`);
    await expect(section).toHaveCount(1);
    await expect(section).toHaveAccessibleName(/.+/);
  }
});

test("skip-to-content link targets a real, focusable main landmark", async ({ page }) => {
  await page.goto("/");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toHaveAttribute("href", "#main-content");
  await expect(page.locator("#main-content")).toHaveCount(1);
  await expect(page.locator("main#main-content")).toHaveCount(1);
});

test("JewelryStore structured data is present and valid", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(json ?? "{}");
  expect(data["@type"]).toBe("JewelryStore");
  expect(data.telephone).toBeTruthy();
  expect(data.address?.addressLocality).toBe("Fulham Gardens");
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
