import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import Carousel from "./Carousel";
import { Quote } from "../icons";

export type Review = { text: string; author: string };

const REVIEWS: Review[] = [
  { text: "We had our wedding rings made by Grech Jewellers and couldn’t be happier. The craftsmanship is outstanding and the service was personal from start to finish. The quality and attention to detail is second to none.", author: "-- Michael & Laura" },
  { text: "Grech Jewellers helped us design a custom engagement ring from scratch. Every step felt personal and the final piece was beyond what we imagined. We couldn’t recommend them more highly.", author: "-- Sarah & James" },
  { text: "From the first consultation to the final fitting, the team made the whole experience effortless. The ring itself is stunning and exactly what we asked for.", author: "-- Emma & David" },
];

/* "Testimonial Quote" instance — quote-mark and text sit side-by-side
   (Figma Frame 53, gap 12), not stacked.
   Fixed height (Figma's Container = 196px) at lg — line-clamp on the quote
   is the safety net that keeps longer copy inside that height instead of
   overflowing. Mobile/tablet stay height:auto (h-full, stretched by the
   carousel slide) since narrower cards wrap to more lines anyway. */
function TestimonialCard({ r }: { r: Review }) {
  return (
    <figure className="gj-review-card flex h-full gap-3 overflow-hidden rounded-lg border border-divider bg-cream-card px-6 py-8 lg:h-[196px]">
      <Quote className="h-[19px] w-5 shrink-0 text-gold-dark" aria-hidden />
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <blockquote className="font-sans text-[14px] leading-[1.6] text-body-2 lg:line-clamp-3">{r.text}</blockquote>
        <figcaption className="font-sans text-[14px] font-medium tracking-[0.07em] text-ink-text">{r.author}</figcaption>
      </div>
    </figure>
  );
}

/* Reviews — three testimonials: a row on desktop, a swipeable carousel with a
   dot pager on tablet and mobile. */
export default function Reviews() {
  return (
    <section id="reviews" aria-label="Reviews" className="bg-cream border-b-4 border-[#c8b08a] pt-16 pb-16 md:pt-20 md:pb-20 lg:py-10">
      <Container>
        <div>
          <SectionHeader
            align="center"
            eyebrow="Reviews"
            title="What Our Clients Say"
            body="Real stories from clients who’ve trusted us with life’s most meaningful pieces."
            ruleWidth={114}
            bodyMaxWidth={636}
          />
        </div>

        {/* tablet + mobile: carousel with dots.
           cardClassName uses vw, not %: the track spans edge-to-edge
           (100vw) at these breakpoints, but its width is also dynamically
           padded (see Carousel) so the first/last card can centre — a %
           width would be relative to that same padded content-box, so
           growing the padding would shrink the card, which would demand
           more padding, with no stable point short of the card collapsing
           to nothing. vw sidesteps that entirely. */}
        <div className="mt-12 lg:hidden">
          <Carousel
            ariaLabel="Client reviews"
            cardClassName="w-[86vw] sm:w-[64vw] md:w-[48vw]"
            snap="center"
            slides={REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
          />
        </div>
      </Container>

      {/* desktop: 3 across, static — Figma's real cards row is a 1448px band
         (inset 236px symmetric on the 1920 canvas), wider than the standard
         1180 Container used everywhere else, so it gets its own width here
         instead of going through <Container>. max-w is 1448 + the px-8
         (32px/side) safety padding, so the grid itself lands at exactly
         1448px once there's room — not 1448 minus the padding. */}
      <div className="mx-auto hidden w-full max-w-[1512px] px-8 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-4">
        {REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
      </div>
    </section>
  );
}
