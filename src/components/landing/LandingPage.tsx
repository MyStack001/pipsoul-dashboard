import Navbar from "./Navbar";
import Hero from "./Hero";
import DashboardPreview from "./DashboardPreview";
import Features from "./Features";
import WhyPipsoul from "./WhyPipsoul";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1120]">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <Features />
      <WhyPipsoul />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}