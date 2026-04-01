import Link from "next/link";
import React from "react";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-[url('/images/hero.png')] bg-cover bg-center text-white">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-brand-gold/10 to-transparent pointer-events-none transform-gpu" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none transform-gpu" />

      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-40">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              A National Insurance Marketplace
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black leading-[1.1] mb-8">
            Insurance Coverage. <br />
            <span className="text-brand-gold italic">
              Local Agents Near You.
            </span>{" "}
            <br />
            Anywhere in the U.S.
          </h1>

          <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12 max-w-2xl font-light">
            Connect with our licensed, vetted insurance agents based on your
            location, needs, and coverage type so you get the right policy, not
            just a quote.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href="/find-agent"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-black text-lg px-10 py-5 rounded-full no-underline transition-all hover:-translate-y-1 shadow-2xl"
            >
              Meet Your Local Agent in 60 Seconds
            </Link>
            <Link
              href="#categories"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-lg px-8 py-5 rounded-full no-underline transition-all"
            >
              Browse Coverage Options
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
