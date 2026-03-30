import HeroBanner from "@/components/home/HeroBanner";
import CoverageSection from "@/components/home/CoverageSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyTrust from "@/components/home/WhyTrust";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <HeroBanner />

      {/* ── COVERAGE GRID ───────────────────────────────────── */}
      <CoverageSection />

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <HowItWorks />

      {/* ── WHY TRUST US ─────────────────────────────────────── */}
      <WhyTrust />
    </div>
  );
}
