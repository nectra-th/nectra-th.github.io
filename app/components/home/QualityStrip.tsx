/* Recurring brand strip ("quality. integrity. craftsmanship. since 1978.")
   shown after the Four Pillars and the Process sections. Figma's "Line 1" is
   a full-width divider (not a faint border) — solid #D8CBB7, 1px, with a
   17px gap (itemSpacing) to the text below, not a generic border+padding
   guess. Cormorant small-caps, 0.1em tracking, 115% line-height, cap-height
   trimmed.
   At tablet the two instances genuinely diverge (verified against
   tablet.1_4838.json): the Process one keeps 20px text with the 17px gap,
   but the Four Pillars one drops to 14px single-line (1.4px tracking =
   exactly the shared 0.1em) with only a 10px gap to its rule — `textClass`
   lets that caller override the size steps without forking the strip. */
export default function QualityStrip({
  className = "",
  textClass = "text-[17px] md:text-lg lg:text-[20px]",
}: { className?: string; textClass?: string }) {
  return (
    <div className={`border-t border-divider pt-[17px] ${className}`}>
      <p className={`fig-trim text-center font-serif leading-[115%] tracking-[0.1em] text-body-2 [font-variant:small-caps] ${textClass}`}>
        quality. integrity. craftsmanship. <span className="text-gold-dark">since 1978.</span>
      </p>
    </div>
  );
}
