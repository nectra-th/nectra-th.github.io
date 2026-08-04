import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import Carousel from "./Carousel";
import { Quote } from "../icons";

export type Review = { text: string; author: string };

// Real client reviews, verbatim (spelling and all — they're quotes).
const REVIEWS: Review[] = [
  { text: "I was left with inherited jewellery that I wanted to onsell. Most jewellers were quoting me $80 per piece to value. David was able to provide accurate information on my quantity of pieces at a fraction of the cost. His knowledge is outstanding. He also replaced stones in two rings with a beautiful result. Im now able to move forward and finish this daunting project thanks to David and Vicki. Wonderful jewellery for assistance. You wont be disappointed!!!", author: "-- Lisa Mugg" },
  { text: "Grech jewellers were great to deal with, when designing the engagement ring they explained everything to me with ease and delivered exactly what I had asked for, their guidance was much appreciated! I felt comfortable straight away with this amazing family business. Price was also great.", author: "-- Marco Di Brino" },
  { text: "I have had a couple of rings made by Grech Jewellers. I have had so many compliments on the both of them. Service is great and the professional attitude is also something that I like. I live away now in Queensland but always deal with David. I can trust Grech Jewellers for a professional outcome, and beautiful jewellery.", author: "-- Barb Baldwin" },
  { text: "I and my family have been very satisfied customers of David and Vicki for over 25 years. Their honesty and integrity is second to none. Congratulations to both of them and also Chris. We are very content to recommend them for their professionalism and friendly and courteous attention.", author: "-- Ben Battiste" },
];

/* "Testimonial Quote" instance — quote-mark and text sit side-by-side
   (Figma Frame 53, gap 12 at every breakpoint), not stacked.
   Each tier gets Figma's own card box, and the quote is line-clamped to the
   exact line count that box was drawn to hold, so varying copy length can't
   overflow or resize the card:
     mobile  296x232, pad 24/16, 12px/24px text, 6 lines  (144+16+24 = 184)
     tablet  356x220, pad 30/17, 12px/24px text, 5 lines  (120+16+24 = 160)
     desktop 472x196, pad 32/24, 14px/1.6  text, 3 lines */
function TestimonialCard({ r }: { r: Review }) {
  return (
    <figure className="gj-review-card flex h-[232px] gap-3 overflow-hidden rounded-lg border border-divider bg-cream-card px-4 py-6 md:h-[220px] md:px-[17px] md:py-[30px] lg:h-[196px] lg:px-6 lg:py-8">
      <Quote className="h-[22px] w-[23px] shrink-0 text-gold-dark lg:h-[19px] lg:w-5" aria-hidden />
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-6">
        <blockquote className="line-clamp-6 font-sans text-[12px] font-medium leading-[24px] text-[#403b37] md:line-clamp-5 lg:line-clamp-3 lg:text-[14px] lg:font-normal lg:leading-[1.6] lg:text-body-2">
          {r.text}
        </blockquote>
        <figcaption className="font-sans text-[12px] font-medium leading-[24px] text-ink-text lg:text-[14px] lg:tracking-[0.07em]">
          {r.author}
        </figcaption>
      </div>
    </figure>
  );
}

/* Reviews — three testimonials: a row on desktop, a swipeable carousel with a
   dot pager on tablet and mobile. */
export default function Reviews() {
  return (
    // Figma section bands: mobile 7896→8614 (718px, content inset 110 top /
    // 171 bottom), tablet 4820→5304 (484px, inset 63 / 54). The bottom insets
    // here are Figma's minus the 34px the dot pager occupies (24 gap + 10
    // dot) and minus the 4px border-b, which the band measurement includes —
    // Figma's small boards draw no pager, so the dots come out of the
    // trailing padding rather than making the section overshoot its band.
    // Desktop band (art audit): dividers at y=6604→7372 = 768 + 4 border =
    // 772px total; eyebrow at 6752 → 148px top inset, cards end 7142 →
    // 230px bottom inset. The desktop carousel's dot pager (24px gap + 10px
    // dot) comes out of that trailing inset — same convention as the small
    // boards — so the band still totals 772.
    <section id="reviews" aria-label="Reviews" className="bg-cream border-b-4 border-[#c8b08a] pt-[110px] pb-[133px] md:pt-[63px] md:pb-[16px] lg:pt-[148px] lg:pb-[196px]">
      <Container>
        {/* Figma's header block is narrower than the section gutter on the
           small boards: 270px on mobile (60px side margins, not the
           Container's 20) and 554px on tablet; desktop lets the body's own
           636px cap take over. */}
        <div className="mx-auto max-w-[270px] md:max-w-[554px] lg:max-w-none">
          <SectionHeader
            align="center"
            eyebrow="Reviews"
            title="What Our Clients Say"
            body="Real stories from clients who’ve trusted us with life’s most meaningful pieces."
            ruleWidth={114}
            bodyMaxWidth={636}
            /* Figma header gaps per board — mobile 24/24/32, tablet 12/20/32,
               desktop 16/32/28 (eyebrow→title, title→rule, rule→body). */
            titleMargin="mt-6 md:mt-3 lg:mt-4"
            ruleMargin="mt-6 md:mt-5 lg:mt-8"
            bodyMargin="mt-8 lg:mt-7"
            /* Reviews' board sets 18px leading on this copy at both small
               tiers; .text-body's base is the cross-section majority (25px),
               which rendered this two-line block 7px too tall. */
            bodyClassName="leading-[18px] lg:leading-[27px]"
          />
        </div>

        {/* tablet + mobile: carousel with dots.
           Figma card widths: 296 on the 390 mobile board (=75.9vw) and a
           flat 356 on the 834 tablet board. Mobile stays vw so it tracks
           narrower phones, capped at Figma's own 296; tablet+ is fixed.
           vw (not %) is deliberate: the track's side padding is derived
           from the card's rendered width so the first/last card can centre
           (see Carousel), and a %-width card would be relative to that same
           padded box — padding would shrink the card, which would demand
           more padding, collapsing it. vw sidesteps that entirely. */}
        <div className="mt-[67px] md:mt-[43px] lg:hidden">
          <Carousel
            ariaLabel="Client reviews"
            cardClassName="w-[75.9vw] max-w-[296px] md:w-[356px] md:max-w-[356px]"
            gapClassName="gap-3 md:gap-4"
            snap="center"
            slides={REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
          />
        </div>
      </Container>

      {/* desktop: same 1448px band as the old static row (inset 236px
         symmetric on the 1920 canvas, wider than the standard 1180
         Container), but now a start-snapped carousel — with four real
         reviews, three 472px cards fill the band exactly (3×472 + 2×16 =
         1448) and the fourth scrolls/auto-advances into view, instead of
         wrapping into a lonely second row under the 3-column grid. */}
      <div className="mx-auto hidden w-full max-w-[1512px] px-8 lg:mt-14 lg:block">
        <Carousel
          ariaLabel="Client reviews"
          cardClassName="w-[472px] max-w-[472px]"
          gap={16}
          snap="start"
          slides={REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
        />
      </div>
    </section>
  );
}
