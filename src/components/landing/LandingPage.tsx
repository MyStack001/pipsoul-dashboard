import Navbar from "./Navbar";
import Hero from "./Hero";
import DashboardPreview from "./DashboardPreview";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1120]">
      <Navbar />
      <Hero />
      <DashboardPreview />
    </main>
  );
}