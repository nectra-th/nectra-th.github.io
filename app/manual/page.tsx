import type { Metadata } from "next";

/* eslint-disable @next/next/no-img-element */

/* Booking System — User Manual. Internal documentation page (robots-blocked,
   not linked from the site), same idea as /design: lives with the product so
   it's always one URL away and screenshots stay versioned with the code.
   Regenerate the screenshots with `node scripts/capture-manual.mjs` (dev
   server running). */

export const metadata: Metadata = {
  title: "Booking System — User Manual | Grech Jewellers",
  robots: { index: false, follow: false },
};

const IMG = "/assets/manual";

function Shot({ src, alt, caption, maxWidth = 860 }: { src: string; alt: string; caption?: string; maxWidth?: number }) {
  return (
    <figure className="my-6">
      <img src={`${IMG}/${src}.png`} alt={alt} loading="lazy" decoding="async" className="w-full rounded-xl border border-divider shadow-[0_12px_40px_rgba(20,19,18,0.12)]" style={{ maxWidth }} />
      {caption && <figcaption className="mt-2 font-sans text-[13px] leading-5 text-body-2">{caption}</figcaption>}
    </figure>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="mt-16 scroll-mt-24 font-serif text-[32px] font-semibold leading-tight text-ink-text first:mt-0">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 font-serif text-[22px] font-semibold text-ink-text">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-[70ch] font-sans text-[15px] leading-[26px] text-[#403b37]">{children}</p>;
}
function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  return (
    <div className={`mt-4 max-w-[70ch] rounded-lg border px-4 py-3 font-sans text-[14px] leading-[22px] ${tone === "warn" ? "border-[#d84b4b]/40 bg-[#d84b4b]/5 text-[#8a3535]" : "border-divider bg-cream-card text-[#403b37]"}`}>
      {children}
    </div>
  );
}
function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-4 max-w-[70ch] list-none space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 font-sans text-[15px] leading-[26px] text-[#403b37]">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold font-sans text-[13px] font-bold text-ink">{i + 1}</span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}
const B = ({ children }: { children: React.ReactNode }) => <strong className="font-semibold text-ink-text">{children}</strong>;
const Code = ({ children }: { children: React.ReactNode }) => <code className="rounded bg-cream-card px-1.5 py-0.5 font-mono text-[13px] text-[#403b37]">{children}</code>;

const TOC = [
  ["overview", "1. Overview — how a booking flows"],
  ["customer", "2. How customers book (the website)"],
  ["admin-login", "3. Signing in to the admin dashboard"],
  ["admin-day", "4. Day schedule — your daily home screen"],
  ["admin-bookings", "5. All bookings"],
  ["admin-availability", "6. Availability — hours, closed days, holidays"],
  ["admin-templates", "7. Email templates"],
  ["admin-outbox", "8. Email outbox"],
  ["faq", "9. Common questions"],
] as const;

export default function ManualPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* header band */}
      <header className="border-b-4 border-[#c8b08a] bg-ink px-6 py-14 text-center">
        <p className="fig-trim font-serif text-[18px] font-semibold uppercase tracking-[0.14em] text-gold-dark">Grech Jewellers</p>
        <h1 className="fig-trim mt-4 font-serif text-[44px] font-semibold text-cream-light md:text-[56px]">Booking System — User Manual</h1>
        <p className="mx-auto mt-5 max-w-[62ch] font-sans text-[15px] leading-[25px] text-line">
          Everything you need to run consultations: how customers book on the website,
          and how you accept, decline and manage those bookings from the admin dashboard.
        </p>
      </header>

      <div className="mx-auto max-w-[960px] px-6 py-14">
        {/* table of contents */}
        <nav aria-label="Contents" className="rounded-xl border border-divider bg-cream-light p-6">
          <p className="font-serif text-[18px] font-semibold text-ink-text">Contents</p>
          <ul className="mt-3 grid gap-2 font-sans text-[14px] sm:grid-cols-2">
            {TOC.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-gold-dark underline-offset-2 hover:underline">{label}</a></li>
            ))}
          </ul>
        </nav>

        {/* 1 ------------------------------------------------------------- */}
        <div className="mt-14">
          <H2 id="overview">1. Overview — how a booking flows</H2>
          <P>
            The booking system has two halves: the <B>booking widget</B>{" "}on the public website
            (the &ldquo;Book a Design Consultation&rdquo; section) and the <B>admin dashboard</B>{" "}at{" "}
            <Code>/admin</Code>, which only staff can open with a password.
          </P>
          <P>Every booking moves through the same simple life cycle:</P>
          <Steps items={[
            <>A customer picks a date and time on the website and submits their details. The booking is created as{" "}
              <B>Pending</B>{" "}— the slot is immediately reserved so nobody else can take it, and the customer gets a{" "}
              &ldquo;request received&rdquo; email.</>,
            <>The request appears in the admin dashboard under <B>&ldquo;new requests — please accept or decline&rdquo;</B>.</>,
            <>You press <B>Accept</B>{" "}(the booking becomes <B>Confirmed</B>{" "}and the customer is sent the confirmation
              email) or <B>Decline</B>{" "}(the slot opens up again for other customers).</>,
          ]} />
          <Note>
            Nothing is ever auto-confirmed. You always have the final say — the website only collects{" "}
            <em>requests</em>, exactly like the &ldquo;Pending Confirmation&rdquo; badge tells the customer.
          </Note>
        </div>

        {/* 2 ------------------------------------------------------------- */}
        <H2 id="customer">2. How customers book (the website)</H2>
        <H3>Step 1 — choose a date and time</H3>
        <P>
          The card shows a checklist of what to bring, a calendar, and the day&rsquo;s time slots.
          Days the store can&rsquo;t take bookings are greyed out automatically:
        </P>
        <ul className="mt-3 max-w-[70ch] list-disc space-y-1.5 pl-6 font-sans text-[15px] leading-[26px] text-[#403b37]">
          <li><B>Sundays</B>{" "}— the store is closed.</li>
          <li><B>Today and tomorrow</B>{" "}— appointments require a minimum of 48 hours&rsquo; notice.</li>
          <li>Dates more than <B>90 days</B>{" "}ahead.</li>
          <li>Any <B>holiday dates</B>{" "}you set in the admin (see section 6).</li>
        </ul>
        <Shot src="01-widget-idle" alt="The booking widget in its idle state, showing checklist, calendar and time slots" caption="The idle booking card. Today's date carries a thin dark ring; greyed dates can't be clicked." />
        <P>
          After picking a date, unavailable times are struck through — already-booked slots, and on{" "}
          <B>Saturdays</B>{" "}the afternoon slots (the store closes at 1:00&nbsp;PM, so the last 45-minute
          consultation starts at 12:00&nbsp;PM). Picking a time reveals the <B>Continue</B>{" "}button:
        </P>
        <Shot src="02-widget-selected" alt="Booking widget with a date and time selected and the Continue button active" caption="Date + time selected — the consultation length note and gold Continue button appear." />

        <H3>Step 2 — enter details</H3>
        <P>
          The middle column summarises the request (date, time, duration, type) so the customer can
          double-check before committing. The form asks for <B>Name</B>, <B>Email</B>{" "}and an{" "}
          <B>Australian mobile number</B>{" "}(the field only accepts digits — letters simply don&rsquo;t type).
          &ldquo;How did you hear about us?&rdquo; is optional. The consent checkbox must be ticked.
        </P>
        <Shot src="03-widget-details" alt="The details step with booking summary and contact form" caption="Step 2 — Your Booking Request summary (left) and the contact form (right). The back arrow returns to the calendar without losing the selection." />

        <H3>If something is missing</H3>
        <P>
          Pressing <B>Request Consultation</B>{" "}with missing or invalid fields outlines each problem
          field in red (and the consent box in bright red). No error text is shown — clicking into a
          field clears its red state, and the customer just fixes it and presses the button again.
        </P>
        <Shot src="04-widget-validation" alt="Validation state with red outlines on empty fields and the consent checkbox" caption="Validation — red outlines mark what needs attention; they clear as soon as the customer clicks into the field." />

        <H3>Step 3 — confirmation</H3>
        <P>
          On success the card flips to a summary + thank-you screen with a{" "}
          <B>Pending Confirmation</B>{" "}badge, and the &ldquo;request received&rdquo; email goes out.
          The customer now waits for you to accept.
        </P>
        <Shot src="05-widget-success" alt="The success screen with booking summary and Thank You message" caption="Step 3 — booking summary on the left, Pending Confirmation status on the right." />

        {/* 3 ------------------------------------------------------------- */}
        <H2 id="admin-login">3. Signing in to the admin dashboard</H2>
        <P>
          Open <Code>grech-jewellers.vercel.app/admin</Code>{" "}in any browser, type the admin password
          and press <B>Enter</B>. The browser remembers it on that device, so you won&rsquo;t be asked
          again until you clear your browsing data.
        </P>
        <Shot src="06-admin-login" alt="The admin login screen" caption="The admin sign-in. One password — no usernames to manage." maxWidth={720} />
        <Note tone="warn">
          Keep the password private — anyone with it can see customer names, phone numbers and emails.
          If it ever leaks, change the <Code>ADMIN_KEY</Code>{" "}setting in Vercel and re-deploy.
        </Note>

        {/* 4 ------------------------------------------------------------- */}
        <H2 id="admin-day">4. Day schedule — your daily home screen</H2>
        <P>
          This is the default view, designed to answer &ldquo;what&rsquo;s happening today?&rdquo; at a glance:
        </P>
        <ul className="mt-3 max-w-[70ch] list-disc space-y-1.5 pl-6 font-sans text-[15px] leading-[26px] text-[#403b37]">
          <li>The gold-framed banner at the top lists <B>every new request</B>{" "}that&rsquo;s waiting, whatever day it&rsquo;s for. <B>Accept</B>{" "}confirms it and emails the customer; <B>Decline</B>{" "}cancels it and frees the slot; <B>Details</B>{" "}shows the full contact info.</li>
          <li>Below it, the <B>day timeline</B>{" "}shows each time slot for the selected date. Use the arrows to move between days, or <B>Today</B>{" "}to jump back.</li>
          <li>Free slots have an <B>Add</B>{" "}button — use it to record walk-in or phone bookings so the website can&rsquo;t double-book that time. Days the store is closed say so.</li>
        </ul>
        <Shot src="07-admin-day" alt="The Day schedule view with pending requests banner and day navigation" caption="Day schedule — pending requests always float at the top so nothing gets missed." />

        {/* 5 ------------------------------------------------------------- */}
        <H2 id="admin-bookings">5. All bookings</H2>
        <P>
          Click <B>Advanced ▾</B>{" "}(top-right) → <B>All bookings</B>{" "}for the complete history, newest
          first — pending, confirmed and cancelled — each with its reference number (e.g.{" "}
          <Code>GJ-260804-3228</Code>, the same one quoted in the customer&rsquo;s emails). You can accept
          or decline from here too.
        </P>
        <Shot src="08-admin-bookings" alt="The All bookings list" caption="All bookings — the full audit trail, colour-coded by status." />

        {/* 6 ------------------------------------------------------------- */}
        <H2 id="admin-availability">6. Availability — hours, closed days, holidays</H2>
        <P>Advanced ▾ → <B>Availability</B>{" "}controls what the website&rsquo;s calendar offers:</P>
        <ul className="mt-3 max-w-[70ch] list-disc space-y-1.5 pl-6 font-sans text-[15px] leading-[26px] text-[#403b37]">
          <li><B>Opening hours</B>{" "}— one row per weekday. Tap the day name to open or close that day
            entirely, and pick the opening and closing time from the dropdowns. The system works out the
            bookable start times itself — the small chips on the right of each row are{" "}
            <em>exactly</em>{" "}the buttons customers will see for that day (Saturday 9:00–1:00 shows only
            the four morning slots, because every consultation must finish before closing).</li>
          <li><B>Consultation length</B>{" "}— appointment duration, also quoted in emails (45 min).</li>
          <li><B>Minimum notice</B>{" "}— 2 means 48 hours&rsquo; notice (customers can book from the day after tomorrow).</li>
          <li><B>Bookable window</B>{" "}— how far ahead the calendar opens (90 days).</li>
          <li><B>Days off / holidays</B>{" "}— pick a date and press <B>Add day off</B>; it appears as a
            chip you can remove with ×. Those dates grey out on the website the moment you save.</li>
          <li><B>Location / Directions URL</B>{" "}— shown inside the customer emails.</li>
        </ul>
        <Shot src="09-admin-availability" alt="The Availability tab with per-day opening hours, slot previews and the day-off picker" caption="Availability — set opening hours per day like a store sign; the slot chips preview exactly what customers get." />
        <Note>
          Nothing here needs a special format — everything is picked from buttons, dropdowns and a date
          picker, and the preview updates before you save. Press <B>Save availability</B>{" "}to apply;
          the website calendar follows immediately.
        </Note>

        {/* 7 ------------------------------------------------------------- */}
        <H2 id="admin-templates">7. Email templates</H2>
        <P>
          Advanced ▾ → <B>Email templates</B>{" "}edits the two automatic emails: <B>Booking received</B>{" "}
          (sent the moment a request comes in) and <B>Booking confirmed</B>{" "}(sent when you press
          Accept). Edit visually with the toolbar, or switch to HTML. <B>Insert variable…</B>{" "}drops
          placeholders like <Code>{"{{name}}"}</Code>, <Code>{"{{date}}"}</Code>,{" "}
          <Code>{"{{time}}"}</Code>{" "}or <Code>{"{{reference}}"}</Code>{" "}that are filled in per booking.
        </P>
        <P>
          Every save keeps the previous version in <B>Version history</B>{" "}— press <B>Revert</B>{" "}to roll
          back if an edit goes wrong. You can&rsquo;t break anything permanently.
        </P>
        <Shot src="10-admin-templates" alt="The email template editor with visual toolbar and version history" caption="Template editor — visual editing, variables, live preview and a revertible version history." />

        {/* 8 ------------------------------------------------------------- */}
        <H2 id="admin-outbox">8. Email outbox</H2>
        <P>
          Advanced ▾ → <B>Email outbox</B>{" "}is the log of every email the system produced — who it went
          to, which template, when, and whether it was sent or is still queued.
        </P>
        <Shot src="11-admin-outbox" alt="The email outbox log" caption="Outbox — a paper trail for every customer email." />
        <Note tone="warn">
          Current status: no email service is connected yet, so emails are <B>queued</B>{" "}in this outbox
          rather than actually delivered. Once an email account is connected (a five-minute setup),
          everything queued here goes out automatically for future bookings.
        </Note>

        {/* 9 ------------------------------------------------------------- */}
        <H2 id="faq">9. Common questions</H2>
        <div className="mt-4 max-w-[70ch] space-y-5">
          {([
            ["We're closed for a public holiday — how do I block the day?", <>Availability → pick the date under <B>Days off / holidays</B>{" "}→ <B>Add day off</B>{" "}→ Save. The website greys it out immediately, and even a direct submission for that date is rejected. Remove the chip with × to reopen the day.</>],
            ["A customer phoned to book — how do I put them in?", <>Day schedule → arrow to their day → press <B>Add</B>{" "}on the free slot and type their name and number. The website can no longer offer that time to anyone else.</>],
            ["What if two people want the same slot?", <>Impossible from the website — the first submission reserves the slot, and anyone else sees it struck through (or gets a &ldquo;just been booked&rdquo; message if they raced). Only you can deliberately overlap a slot, via the walk-in form&rsquo;s <B>allow overlap</B>{" "}option.</>],
            ["I declined by mistake — can I undo it?", <>Yes — find the booking under <B>All bookings</B>{" "}and press Accept. (If someone else has taken the slot in the meantime, re-add it manually via the Day schedule.)</>],
            ["Does declining notify the customer?", <>Not automatically — the slot is freed, but no email is sent. If you want the customer told, contact them directly (their phone and email are under Details).</>],
            ["Where do I change the opening hours?", <>The <B>booking calendar&rsquo;s</B>{" "}hours are fully yours: Availability → set each day&rsquo;s open/close times (or close the day) → Save. The printed hours in the website&rsquo;s <B>Find Us</B>{" "}section are separate static text — if the store&rsquo;s real hours ever change permanently, ask the developer to update that text to match.</>],
          ] as [string, React.ReactNode][]).map(([q, a]) => (
            <div key={q}>
              <p className="font-sans text-[15px] font-bold leading-6 text-ink-text">{q}</p>
              <p className="mt-1.5 font-sans text-[15px] leading-[26px] text-[#403b37]">{a}</p>
            </div>
          ))}
        </div>

        <footer className="mt-16 border-t border-divider pt-6 font-sans text-[13px] text-body-2">
          Grech Jewellers — Booking System Manual · This page is internal (not indexed, not linked from the site).
        </footer>
      </div>
    </main>
  );
}
