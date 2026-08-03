import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "C:/Users/Phil/Grech Jew/site/public/assets/manual";
fs.mkdirSync(OUT, { recursive: true });
const env = Object.fromEntries(fs.readFileSync("C:/Users/Phil/Grech Jew/site/.env.local", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1.5 });

// strip the Next.js dev-indicator badge (the "N" bubble bottom-left) plus any
// other fixed corner overlay so it never appears in manual screenshots
const zapDevBadge = (p) => p.evaluate(() => {
  document.querySelectorAll("nextjs-portal, [data-nextjs-toast], [data-next-badge-root]").forEach((e) => e.remove());
  [...document.querySelectorAll("body > *")].forEach((e) => {
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    if (cs.position === "fixed" && r.width < 90 && r.height < 90 && r.bottom > innerHeight - 120 && r.left < 120) e.remove();
  });
});

// re-resolve the widget card fresh each time — React swaps the card element
// when the step changes, so a stored handle goes stale.
const widgetCard = () => page.evaluateHandle(() => [...document.querySelectorAll("#book div")].find(d => (d.getAttribute("style") || "").includes("backdrop-filter")));

async function shotEl(getHandle, name, pad = 24) {
  const handle = typeof getHandle === "function" ? await getHandle() : getHandle;
  await zapDevBadge(page);
  const b = await handle.asElement().boundingBox();
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(1440 - Math.max(0, b.x - pad), b.width + pad * 2), height: b.height + pad * 2 } });
  console.log("captured", name);
}

// ---------- customer flow ----------
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; document.getElementById("book").scrollIntoView({ block: "center" }); });
await page.waitForTimeout(1500);


// 1. idle
await shotEl(widgetCard, "01-widget-idle");

// 2. date+time picked
await page.evaluate(() => [...document.querySelectorAll("#book .gj-datecell")].filter(b => !b.disabled)[1].click());
await page.waitForTimeout(400);
await page.evaluate(() => [...document.querySelectorAll("#book .gj-timeslot")].filter(b => !b.disabled)[1].click());
await page.waitForTimeout(500);
await shotEl(widgetCard, "02-widget-selected");

// 3. details step
await page.evaluate(() => [...document.querySelectorAll("#book button")].find(b => b.textContent.trim() === "Continue").click());
await page.waitForTimeout(600);
await shotEl(widgetCard, "03-widget-details");

// 4. validation errors (press submit empty)
await page.evaluate(() => [...document.querySelectorAll("#book button")].find(b => b.textContent.includes("Request Consultation")).click());
await page.waitForTimeout(600);
await shotEl(widgetCard, "04-widget-validation");

// 5. success (mock the POST so no real booking is created)
await page.route("**/api/bookings", (route) => {
  if (route.request().method() === "POST") return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, booking: { id: "bk_demo", reference: "GJ-DEMO-0000", status: "pending" } }) });
  return route.continue();
});
await page.evaluate(() => {
  const set = (el, v) => { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set; s.call(el, v); el.dispatchEvent(new Event("input", { bubbles: true })); };
  const ins = [...document.querySelectorAll("#book input.gj-field")];
  set(ins[0], "Jane Smith"); set(ins[1], "jane@example.com"); set(ins[2], "0412 345 678");
  document.querySelector("#book input[type=checkbox]").click();
});
await page.waitForTimeout(400);
await page.evaluate(() => [...document.querySelectorAll("#book button")].find(b => b.textContent.includes("Request Consultation")).click());
await page.waitForTimeout(1500);
await shotEl(widgetCard, "05-widget-success");
await page.unroute("**/api/bookings");

// ---------- admin ----------
// login screen (fresh context, no key)
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1.5 });
const p2 = await ctx2.newPage();
await p2.goto("http://localhost:3000/admin", { waitUntil: "networkidle", timeout: 60000 });
await p2.waitForTimeout(600);
await zapDevBadge(p2);
await p2.screenshot({ path: `${OUT}/06-admin-login.png` });
console.log("captured 06-admin-login");
await ctx2.close();

// authed views
await page.goto(`http://localhost:3000/admin?key=${encodeURIComponent(env.ADMIN_KEY)}`, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
await zapDevBadge(page);
await page.screenshot({ path: `${OUT}/07-admin-day.png`, fullPage: false });
console.log("captured 07-admin-day");

// advanced tabs
const openTab = async (label, name) => {
  // open the Advanced group only when the tab buttons aren't rendered yet —
  // the toggle flips state, so clicking it every round closes it again.
  const clicked = await page.evaluate((label) => {
    const tabBtn = () => [...document.querySelectorAll("button")].find(x => x.textContent.trim().toLowerCase().includes(label));
    if (!tabBtn()) {
      const adv = [...document.querySelectorAll("button")].find(x => x.textContent.toLowerCase().includes("advanced"));
      if (adv) adv.click();
    }
    return !!tabBtn();
  }, label);
  if (!clicked) await page.waitForTimeout(400);
  const ok = await page.evaluate((label) => { const b = [...document.querySelectorAll("button")].find(x => x.textContent.trim().toLowerCase().includes(label)); if (b) { b.click(); return true; } return false; }, label);
  await page.waitForTimeout(1500);
  await zapDevBadge(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log("captured", name, "(tab clicked:", ok + ")");
};
await openTab("bookings", "08-admin-bookings");
await openTab("availability", "09-admin-availability");
await openTab("templates", "10-admin-templates");
await openTab("outbox", "11-admin-outbox");

await browser.close();
console.log("ALL DONE");
