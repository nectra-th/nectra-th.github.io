import { Container } from "./ui";
import SectionHeader from "./SectionHeader";
import Carousel from "./Carousel";
import { Quote } from "../icons";

const REVIEWS = [
  { text: "We had our wedding rings made by Grech Jewellers and couldn’t be happier. The craftsmanship is outstanding and the service was personal from start to finish. The quality and attention to detail is second to none.", author: "— Michael & Laura" },
  { text: "We had our wedding rings made by Grech Jewellers and couldn’t be happier. The craftsmanship is outstanding and the service was personal from start to finish. The quality and attention to detail is second to none.", author: "— Michael & Laura" },
  { text: "We had our wedding rings made by Grech Jewellers and couldn’t be happier. The craftsmanship is outstanding and the service was personal from start to finish. The quality and attention to detail is second to none.", author: "— Michael & Laura" },
];

function TestimonialCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure className="gj-review-card flex h-full flex-col rounded-lg border border-divider bg-cream-card p-7">
      <Quote className="h-6 w-7 text-gold" aria-hidden />
      <blockquote className="mt-4 flex-1 font-sans text-[13.5px] leading-relaxed text-[#403b37]">{r.text}</blockquote>
      <figcaption className="mt-5 font-sans text-[13.5px] font-semibold text-ink-text">{r.author}</figcaption>
    </figure>
  );
}

/* Reviews — three testimonials: a row on desktop, a swipeable carousel with a
   dot pager on tablet and mobile. */
export default function Reviews() {
  return (
    <section className="bg-cream py-16 md:py-20 lg:py-24">
      <Container>
        <div data-reveal>
          <SectionHeader
            align="center"
            eyebrow="Reviews"
            title="What Our Clients Say"
            body="Real stories from clients who’ve trusted us with life’s most meaningful pieces."
          />
        </div>

        {/* desktop: 3 across */}
        <div className="mt-12 hidden gap-8 lg:grid lg:grid-cols-3" data-reveal>
          {REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
        </div>

        {/* tablet + mobile: carousel with dots */}
        <div className="mt-12 lg:hidden" data-reveal>
          <Carousel
            ariaLabel="Client reviews"
            cardClassName="w-[86%] sm:w-[64%] md:w-[48%]"
            snap="center"
            slides={REVIEWS.map((r, i) => <TestimonialCard key={i} r={r} />)}
          />
        </div>
      </Container>
    </section>
  );
}
