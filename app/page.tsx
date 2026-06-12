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
import { ScrollProvider, MagneticCursor, ScrollTicker } from "./components/ScrollEffects";

export default function Home() {
  return (
    <ScrollProvider>
      <MagneticCursor />
      <main className="bg-[#050810] min-h-screen">
        <Navigation />
        <Hero />
        <ScrollTicker items={[
          'Residential Solar', 'Commercial Solar', 'Industrial Solutions',
          '25+ Years Experience', '10,000+ Installations', '150 MW+ Capacity',
          'Smart Monitoring', 'Energy Independence', 'Zero Carbon Future',
        ]} />
        <Banner3D />
        <Solutions />
        <Stats />
        <ScrollTicker items={[
          'Award Winning', 'Certified Engineers', '98% Satisfaction',
          'Premium Panels', '25-Year Warranty', '24/7 Support',
          'ROI Optimized', 'Grid-Ready Systems', 'Smart Analytics',
        ]} speed={50} />
        <Timeline />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    </ScrollProvider>
  );
}
