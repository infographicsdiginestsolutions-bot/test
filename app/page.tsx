import Navigation from "./components/Navigation/Navigation";
import Hero from "./components/Hero/Hero";
import Banner3D from "./components/Banner/Banner3D";
import Solutions from "./components/Solutions/Solutions";
import Stats from "./components/Stats/Stats";
import Timeline from "./components/Timeline/Timeline";
import Testimonials from "./components/Testimonials/Testimonials";
import Pricing from "./components/Pricing/Pricing";
import CTA from "./components/CTA/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-[#050810] min-h-screen">
      <Navigation />
      <Hero />
      <Banner3D />
      <Solutions />
      <Stats />
      <Timeline />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
