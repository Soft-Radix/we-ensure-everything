import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  {
    code: "COMMERCIAL",
    icon: "🏢",
    name: "Commercial Insurance",
    desc: "General liability, BOP, cyber, workers comp & more",
  },
  {
    code: "HEALTH",
    icon: "🏥",
    name: "Health, Life & Disability",
    desc: "Individual health, life, disability, LTC & annuities",
  },
  {
    code: "PERSONAL",
    icon: "🏠",
    name: "Personal Insurance",
    desc: "Auto, home, renters, umbrella & flood coverage",
  },
  {
    code: "MEDICARE",
    icon: "👴",
    name: "Medicare & Senior",
    desc: "Medicare supplement, advantage, Part D & final expense",
  },
  {
    code: "FINANCIAL",
    icon: "📊",
    name: "Financial & Legal",
    desc: "IUL, annuities, wealth management & legal expense",
  },
  {
    code: "GROUP",
    icon: "👥",
    name: "Group Benefits",
    desc: "Group health, dental, 401k & employee benefits",
  },
];

const steps = [
  {
    step: "01",
    title: "Select Your County",
    desc: "Search from all 3,143 U.S. counties to find your exact coverage area.",
  },
  {
    step: "02",
    title: "Choose Coverage Type",
    desc: "Pick from 6 insurance categories and the specific product you need.",
  },
  {
    step: "03",
    title: "Get Your Agent",
    desc: "We instantly match you to the exclusive licensed agent in your county.",
  },
];

const stats = [
  { value: "3,143", label: "U.S. Counties Covered" },
  { value: "6", label: "Insurance Categories" },
  { value: "60+", label: "Products Available" },
  { value: "1", label: "Exclusive Agent Per County" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D5A8A] via-[#1378B2] to-[#1A8FD1] text-white">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-[#F67B13]/10" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <span className="w-2 h-2 bg-[#3FCF40] rounded-full animate-pulse" />
              AgentPro! Powered Platform
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Your Insurance Journey{" "}
              <span className="text-[#F67B13]">Starts Here.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl">
              We match you with <strong>one exclusive, licensed agent</strong>{" "}
              in your county — dedicated to your coverage, guaranteed. No
              generic calls. No runaround. Just your agent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/find-agent"
                className="inline-flex items-center justify-center gap-2 bg-[#F67B13] hover:bg-[#D96608] text-white font-black text-base px-8 py-4 rounded-full no-underline transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                🔍 Find My Agent Now
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-base px-8 py-4 rounded-full no-underline transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-black text-[#1378B2]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-sm text-slate-500 font-medium mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-[#1378B2] font-bold text-sm uppercase tracking-widest mb-3">
              Simple Process
            </span>
            <h2
              className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              How It Works
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Three steps to find your dedicated insurance specialist — takes
              less than a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-[#1378B2]/30 z-10" />
                )}
                <div
                  className="w-12 h-12 rounded-xl bg-[#E8F4FD] flex items-center justify-center font-black text-[#1378B2] text-lg mb-5"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {s.step}
                </div>
                <h3
                  className="font-bold text-lg text-slate-900 mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/find-agent"
              className="inline-flex items-center gap-2 bg-[#1378B2] hover:bg-[#0D5A8A] text-white font-bold px-8 py-4 rounded-full no-underline transition-all hover:-translate-y-0.5 shadow-md"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Start Your Search →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section id="categories" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-[#1378B2] font-bold text-sm uppercase tracking-widest mb-3">
              All Coverage Types
            </span>
            <h2
              className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              What Would You Like to Insure?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Choose a category and we&apos;ll connect you with your
              county&apos;s exclusive specialist.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.code}
                href={`/find-agent?category=${cat.code}`}
                className="group flex flex-col gap-4 p-7 bg-white border-2 border-slate-200 hover:border-[#1378B2] rounded-2xl no-underline transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl">{cat.icon}</div>
                <div>
                  <h3
                    className="font-bold text-base text-slate-900 mb-1.5 group-hover:text-[#1378B2] transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[#1378B2] font-semibold text-sm">
                  Find Agent{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVITY SECTION ───────────────────────────────── */}
      <section
        id="about"
        className="py-20 md:py-28 bg-gradient-to-br from-[#0D5A8A] to-[#1378B2] text-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[#F67B13] font-bold text-sm uppercase tracking-widest mb-3">
                BNI-Style Exclusivity
              </span>
              <h2
                className="text-3xl md:text-4xl font-black leading-tight mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                One Agent. One County. Your Coverage.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Every county × every insurance category × every product has
                exactly <strong>one</strong> dedicated, licensed agent. No
                competition. No confusion. Just accountability and commitment to
                your needs.
              </p>
              <ul className="space-y-4">
                {[
                  "Exclusive territory — no competing agents in your county",
                  "Licensed specialists per coverage type",
                  "Instant routing — matched in under 2 seconds",
                  "Nationwide coverage across all 3,143 U.S. counties",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/85 text-base"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#3FCF40] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-3xl p-10 border border-white/20">
              <h3
                className="font-black text-2xl mb-8 text-center"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Ready to Find Your Agent?
              </h3>
              <div className="space-y-4 mb-8">
                {[
                  { label: "Select your county", done: false },
                  { label: "Choose insurance type", done: false },
                  { label: "Pick your product", done: false },
                  { label: "Meet your agent!", done: false },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-white/85 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/find-agent"
                className="block text-center bg-[#F67B13] hover:bg-[#D96608] text-white font-black py-4 px-6 rounded-2xl no-underline transition-all hover:-translate-y-0.5 shadow-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                🔍 Find My Agent Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────── */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {[
              { icon: "🔒", label: "Secure & Private" },
              { icon: "⚡", label: "Instant Matching" },
              { icon: "🏅", label: "Licensed Agents Only" },
              { icon: "🗺️", label: "All 50 U.S. States" },
              { icon: "🤝", label: "No Obligation" },
            ].map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="text-3xl">{b.icon}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
