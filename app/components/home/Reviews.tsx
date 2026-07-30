import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import Carousel from "./Carousel";
import ReviewsPager from "./ReviewsPager";
import { Quote } from "../icons";

export type Review = { text: string; author: string };

const REVIEWS: Review[] = [
  { text: "We had our wedding rings made by Grech Jewellers and couldn’t be happier. The craftsmanship is outstanding and the service was personal from start to finish. The quality and attention to detail is second to none.", author: "-- Michael & Laura" },
  { text: "Grech Jewellers helped us design a custom engagement ring from scratch. Every step felt personal and the final piece was beyond what we imagined. We couldn’t recommend them more highly.", author: "-- Sarah & James" },
  { text: "From the first consultation to the final fitting, the team made the whole experience effortless. The ring itself is stunning and exactly what we asked for.", author: "-- Emma & David" },
  { text: "We’ve had several pieces restored and remodelled here over the years. The craftsmanship is always exceptional and the advice is honest, never pushy.", author: "-- Robert & Anne" },
  { text: "Choosing Grech Jewellers for our wedding bands was the best decision we made. The team took the time to understand exactly what we wanted.", author: "-- Thomas & Olivia" },
  { text: "The personal service here is unmatched. They guided us through every option without any pressure, and the final result was perfect.", author: "-- Daniel & Sophie" },
  { text: "Our family has trusted Grech Jewellers for generations. The quality of their work and the honesty of their advice speaks for itself.", author: "-- William & Grace" },
  { text: "We had a family heirloom remodelled into a modern setting, and the result was breathtaking. True craftsmanship and care in every detail.", author: "-- Charlotte & Henry" },
  { text: "The team went above and beyond to make our anniversary gift special. Professional, warm, and incredibly skilled from start to finish.", author: "-- Isabella & Jack" },
];

/* "Testimonial Quote" instance — quote-mark and text sit side-by-side
   (Figma Frame 53, gap 12), not stacked. Exported so the desktop pager
   (ReviewsPager, a client component) can reuse it.
   Fixed height (Figma's Container = 196px) at lg so paging between the 9
   reviews doesn't jump the card/row size as text length varies — line-clamp
   on the quote is the safety net that keeps longer copy inside that height
   instead of overflowing. Mobile/tablet stay height:auto (h-full, stretched
   by the carousel slide) since narrower cards wrap to more lines anyway. */
export function TestimonialCard({ r }: { r: Review }) {
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
    // Figma's section band runs Line19 (y=6604) to Line20 (y=7372, 768px
    // total, matching the original skeleton height) with the content block
    // (Frame 341) inset 148px from the top. Bottom padding tuned to 188px.
    <section id="reviews" aria-label="Reviews" className="bg-cream border-b-4 border-[#c8b08a] pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-[148px] lg:pb-[188px]">
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

        {/* tablet + mobile: carousel with dots */}
        <div className="mt-12 lg:hidden">
          <Carousel
            ariaLabel="Client reviews"
            cardClassName="w-[86%] sm:w-[64%] md:w-[48%]"
            snap="center"
            slides={REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
          />
        </div>
      </Container>

      {/* desktop: 3 across, paged 3-per-page across the 9 reviews via the
         3-dot pager (see ReviewsPager for the exact Figma measurements). */}
      <ReviewsPager reviews={REVIEWS} />
    </section>
  );
}
