// End-to-end test of the Availability opening-hours editor: drives the real
// admin UI, then verifies the API, the public calendar, and direct-POST
// validation all follow — and restores the original settings via the UI.
import { chromium } from "playwright";
import fs from "node:fs";

const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));
const B = "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

const gotoAvail = async () => {
  await page.goto(`${B}/admin?key=${encodeURIComponent(env.ADMIN_KEY)}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { const adv = [...document.querySelectorAll("button")].find(x => x.textContent.toLowerCase().includes("advanced")); if (adv) adv.click(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => [...document.querySelectorAll("button")].find(x => x.textContent.trim().toLowerCase().includes("availability")).click());
  await page.waitForTimeout(1200);
};
const setSatClose = async (hour) => {
  await page.evaluate((hour) => {
    const satRow = [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Sat").closest("div");
    const sels = satRow.querySelectorAll("select");
    const set = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
    set.call(sels[1], String(hour));
    sels[1].dispatchEvent(new Event("change", { bubbles: true }));
  }, hour);
  await page.waitForTimeout(300);
};
const clickBtn = async (text) => { await page.evaluate((text) => [...document.querySelectorAll("button")].find(b => b.textContent.trim() === text).click(), text); await page.waitForTimeout(300); };
const save = async () => {
  await clickBtn("Save availability");
  await page.waitForTimeout(1500);
  return page.evaluate(() => [...document.querySelectorAll("span")].map(s => s.textContent).find(t => t.includes("Saved") || t.includes("error") || t.includes("short")));
};

await gotoAvail();

// blackout: next Thursday at least 3 days out
const th = new Date(); th.setDate(th.getDate() + 3);
while (th.getDay() !== 4) th.setDate(th.getDate() + 1);
const thIso = th.toISOString().slice(0, 10);

// 1) close Wednesday, 2) Saturday closes 12 PM, 3) add a day off
await clickBtn("Wed");
await setSatClose(12);
await page.fill("input[type=date]", thIso);
await clickBtn("Add day off");
const preview = await page.evaluate(() => {
  const satRow = [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Sat").closest("div");
  return [...satRow.querySelectorAll("span")].map(s => s.textContent).filter(t => /:00/.test(t));
});
console.log("Sat preview after change:", JSON.stringify(preview));
console.log("save:", await save());

// 4) API reflects
const av = (await (await fetch(`${B}/api/bookings`)).json()).availability;
console.log("API:", JSON.stringify({ openWeekdays: av.openWeekdays, sat: av.dayHours["6"], blackouts: av.blackoutDates, slots: av.timeSlots.length }));

// 5) public calendar follows
const p2 = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await p2.goto(B, { waitUntil: "networkidle", timeout: 60000 });
await p2.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; document.getElementById("book").scrollIntoView({ block: "center" }); });
await p2.waitForTimeout(1200);
const label = new Date(thIso + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long" });
const cal = await p2.evaluate((label) => {
  const cells = [...document.querySelectorAll('#book [aria-label*="2026"]')];
  const weds = cells.filter(b => (b.getAttribute("aria-label") || "").startsWith("Wednesday"));
  const thCell = cells.find(b => (b.getAttribute("aria-label") || "").includes(label));
  return { wedsAllDisabled: weds.every(b => b.disabled), blackoutDisabled: thCell ? thCell.disabled : "not visible this month" };
}, label);
console.log("calendar:", JSON.stringify(cal));
await p2.evaluate(() => { [...document.querySelectorAll("#book .gj-datecell")].find(b => !b.disabled && (b.getAttribute("aria-label") || "").startsWith("Saturday")).click(); });
await p2.waitForTimeout(500);
console.log("Sat slots on site:", JSON.stringify(await p2.evaluate(() => [...document.querySelectorAll("#book button")].filter(b => /^\d{1,2}:00(AM|PM)$/.test(b.textContent.trim())).map(b => b.textContent.trim() + (b.disabled ? " X" : " O")))));

// 6) direct POST rejections
const nextDow = (dow) => { const d = new Date(); d.setDate(d.getDate() + 2); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };
const post = async (date, time) => (await fetch(`${B}/api/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, time, name: "E2E Hours2", email: "zalaterx@gmail.com", phone: "0412 345 678" }) })).status;
console.log("POST Wed 10AM:", await post(nextDow(3), "10:00 AM"), "| POST Sat 12PM:", await post(nextDow(6), "12:00 PM"), "| POST blackout Thu 10AM:", await post(thIso, "10:00 AM"));

// 7) restore via the UI
await gotoAvail();
await clickBtn("Wed");
await setSatClose(13);
await page.evaluate(() => { const x = [...document.querySelectorAll("button")].find(b => (b.getAttribute("aria-label") || "").startsWith("Remove")); if (x) x.click(); });
await page.waitForTimeout(300);
console.log("restore save:", await save());
const av2 = (await (await fetch(`${B}/api/bookings`)).json()).availability;
console.log("RESTORED:", JSON.stringify({ openWeekdays: av2.openWeekdays, sat: av2.dayHours["6"], blackouts: av2.blackoutDates, slots: av2.timeSlots }));

await browser.close();
