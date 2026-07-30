import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import WhyIntro from "../components/home/WhyIntro";
import FourPillars from "../components/home/FourPillars";
import WhatWeDo from "../components/home/WhatWeDo";
import Process from "../components/home/Process";
import Featured from "../components/home/Featured";
import Reviews from "../components/home/Reviews";
import Brands from "../components/home/Brands";
import Booking from "../components/home/Booking";
import FindUs from "../components/home/FindUs";
import ClosingCTA from "../components/home/ClosingCTA";
import Footer from "../components/home/Footer";

export const metadata = { title: "Grech Jewellers — full build (backup)", robots: { index: false } };

/* Backup of the completed homepage (moved here when the index was reset to a
   section-skeleton). Restore by copying this back into app/page.tsx. */
export default function FullBuild() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyIntro />
        <FourPillars />
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
