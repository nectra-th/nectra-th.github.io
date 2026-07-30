/* Homepage — full build. Sections are rendered top-to-bottom below, each
   verified section-by-section against the Figma desktop artboard (heights
   sum to 11088px). The previous complete build is backed up at /full. */

import Header from "./components/home/Header";
import Hero from "./components/home/Hero";
import WhyIntro from "./components/home/WhyIntro";
import FourPillars from "./components/home/FourPillars";
import WhatWeDo from "./components/home/WhatWeDo";
import Process from "./components/home/Process";
import Featured from "./components/home/Featured";
import Reviews from "./components/home/Reviews";
import Brands from "./components/home/Brands";
import Booking from "./components/home/Booking";
import FindUs from "./components/home/FindUs";
import ClosingCTA from "./components/home/ClosingCTA";
import Footer from "./components/home/Footer";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded focus-visible:bg-gold focus-visible:px-4 focus-visible:py-2 focus-visible:text-ink focus-visible:no-underline">
        Skip to content
      </a>
      <Header />
      {/* the header is a fixed overlay ON TOP of the hero video (per Figma —
         its own 108px-tall rect is drawn over the top of the hero, the page
         doesn't reserve space for it), so no top offset here. */}
      <main id="main-content">
        <Hero />
        {/* Why Grech + Four Pillars share this wrapper so the pen-sketch
           backdrop (bleeding down from Why Grech into Four Pillars) is always
           clipped exactly at Four Pillars' own bottom border, however tall
           either section renders — instead of a hardcoded height that could
           under/overshoot that boundary on resize. */}
        <div className="relative overflow-hidden">
          <WhyIntro />
          <FourPillars />
        </div>
        <WhatWeDo />
        <Process />
        <Featured />
        <Reviews />
        <Brands />
        <Booking />
        <FindUs />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
