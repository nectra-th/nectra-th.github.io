import Header from "../components/Header";
import Hero from "../components/Hero";
import WhyGrech from "../components/WhyGrech";
import FourPillars from "../components/FourPillars";
import WhatWeDo from "../components/WhatWeDo";
import OurProcess from "../components/OurProcess";
import FeaturedCreations from "../components/FeaturedCreations";
import Reviews from "../components/Reviews";
import Brands from "../components/Brands";
import Booking from "../components/Booking";
import FindUs from "../components/FindUs";
import FooterCTA from "../components/FooterCTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyGrech />
        <FourPillars />
        <WhatWeDo />
        <OurProcess />
        <FeaturedCreations />
        <Reviews />
        <Brands />
        <Booking />
        <FindUs />
        <FooterCTA />
      </main>
      <Footer />
    </>
  );
}
