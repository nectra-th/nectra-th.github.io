"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import BookingWidget from "./BookingWidget";

const PHOTO_SRC = "/assets/consultation-02.png";
const PHOTO_ALT = "A jeweller discussing a custom design with clients at the counter";

/* Book a Design Consultation — Figma (`1:4212` copy, `1:3807` photo, `IDLE
   STATE` widget, all relative to the section's own top at y=7657):
     copy   — x=370 w=397, top 244px, the same SectionHeader pattern as every
              other section (56px heading, 114px rule — matches Why Grech's).
     photo  — x=783 w=1137 top 153px, bleeding to the viewport's right edge
              (783+1137=1920 exactly).
     widget — x=370 w=1180 top 631px — width matches the standard Container
              exactly, so it's centred the normal way but lifted out of flow
              (absolute, z-30 — frontmost) to float over the photo's lower
              ~284px, per Figma's glassmorphic card-over-photo composition.
   The heading's widest line ("Piece Begins With") actually only measures
   ~397px at 56px Cormorant — it fits Figma's literal column fine on its own
   (the earlier "overflow" was the now-removed CTA row, which needed ~497px).
   Copy column kept at 400px (397 + a thin 3px safety margin for font-hinting
   variance across browsers) — narrow enough that the photo can be Figma's
   *actual* full size (1137×762) at Figma's *actual* position (left:413px,
   i.e. x=783 at the 1920 reference) instead of shrunk to fit, which is what
   an earlier pass did when the column was a wider, more defensive 420px.
   Photo is fixed size/position — explicitly NOT vw-scaled, so it stays
   exactly 1137×762 at every lg-tier width rather than growing or shrinking
   with the viewport (the section's own `overflow-hidden` clips it cleanly at
   the narrow end of lg instead of causing page-level horizontal scroll).
   Corners: Figma's `rectangleCornerRadii` is [16,0,0,16] — rounded only on
   the left (the bled right edge stays square), reproduced with `rounded-l-2xl`.
   The photo's fixed offset is measured from the *Container's own edge*
   (413px in — both the copy Container and this wrapper use `lg:!px-0`/no
   gutter, so they share the same x=370 reference as Figma), not the viewport
   edge — a bare `left:783px` matched the 1920-reference Container's position
   by coincidence, but on very wide screens (2560px+) the Container re-centres
   itself while a viewport-relative offset doesn't move, so the photo drifted
   left of the copy text and covered half the heading. Wrapping the photo in
   its own Container-mimicking div (mx-auto max-w-1180) makes it track the
   same centring math as the text column at any width, including ultra-wide.
   Gap is Figma's own literal 16px (400 copy width to 413 photo offset,
   vs. Figma's copy-ends-767/photo-starts-783) — the 3px safety margin above
   just eats 3px off that gap rather than needing to shrink the photo.
   Below `lg` everything reverts to a normal stacked flow (contained photo,
   non-overlapping widget) since the overlap is a desktop-only composition. */
export default function Booking() {
  const [stacked, setStacked] = useState(true);
  useEffect(() => {
    // 3-column layout only once there's genuinely room for it (the checklist
    // labels don't wrap); below this the widget stacks to a single column.
    const mq = window.matchMedia("(min-width: 1180px)");
    const apply = () => setStacked(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Desktop gets the absolute, overlapping-the-photo composition; below `lg`
  // the widget sits in normal flow instead. Tracked in JS (rather than a
  // CSS-hidden duplicate at each breakpoint) so the widget — and its
  // interactive state — only ever renders once in the DOM.
  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setOverlay(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const widget = <BookingWidget stacked={stacked} />;

  return (
    <section id="book" aria-label="Book a Design Consultation" className="relative overflow-hidden bg-cream py-16 md:py-20 lg:min-h-[1247px] lg:py-0">
      {/* copy — normal-flow Container; at lg it just gets a fixed max-width +
         top padding to land at Figma's exact offset. `lg:!px-0` cancels the
         Container's own 32px gutter — Figma's copy sits flush against the
         container's true edge (x=370), not inset from it. */}
      <Container className="relative lg:!px-0">
        <div className="lg:max-w-[400px] lg:pt-[244px]">
          <SectionHeader
            eyebrow="Book A Design Consultation"
            title={<>Every Meaningful<br />Piece Begins With<br /><span className="text-gold">A Conversation</span></>}
            body="Meet directly with the jeweller to discuss your ideas, explore options and receive honest, obligation-free advice tailored to you."
            ruleWidth={114}
          />
        </div>

        {/* photo — mobile/tablet: contained, in-flow. Hidden at lg in favour
           of the bleed-to-edge version below. */}
        <div className="mt-10 lg:hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl" style={{ boxShadow: "0 22px 60px rgba(20,19,18,0.16)" }}>
            <Image src={PHOTO_SRC} alt={PHOTO_ALT} fill sizes="(min-width: 640px) 560px, 90vw" className="object-cover" />
          </div>
        </div>

        {!overlay && (
          <div className="mt-10">
            {widget}
          </div>
        )}
      </Container>

      {/* photo, desktop — Figma's actual full size (1137×762), fixed (not
         vw-scaled, see note above), rounded on the left only per Figma's
         rectangleCornerRadii. Positioned 413px inside a Container-mimicking
         wrapper (no px gutter, matching the copy's own flush edge above) so
         it tracks the same centring as the copy text at every viewport width. */}
      <div className="absolute inset-x-0 hidden lg:top-[153px] lg:block">
        <div className="relative mx-auto max-w-[1180px]">
          <div className="absolute overflow-hidden rounded-l-2xl lg:left-[413px] lg:h-[762px] lg:w-[1137px]">
            <Image src={PHOTO_SRC} alt={PHOTO_ALT} fill sizes="1137px" className="object-cover" />
          </div>
        </div>
      </div>

      {/* widget, desktop — absolute + frontmost z-index, floating over the
         photo's lower portion. Same `lg:!px-0` as the copy Container, so the
         card renders at Figma's literal 1180px width instead of 1116px. */}
      {overlay && (
        <div className="absolute inset-x-0 z-30 top-[631px]">
          <Container className="lg:!px-0">{widget}</Container>
        </div>
      )}
    </section>
  );
}
