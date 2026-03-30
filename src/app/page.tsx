import dynamic from "next/dynamic";
import HeroBanner from "@/components/home/HeroBanner";

const CoverageSection = dynamic(
  () => import("@/components/home/CoverageSection"),
);
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"));
const WhyTrust = dynamic(() => import("@/components/home/WhyTrust"));

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
