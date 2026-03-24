import Link from "next/link";

import Image from "next/image";
import { categories, steps, trustPoints } from "@/lib/data/static";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-brand-gold/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />

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
                Matched to You.
              </span>{" "}
              <br />
              Anywhere in the U.S.
            </h1>

            <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12 max-w-2xl font-light">
              Connect with our licensed, vetted insurance agents based on your
              location, needs, and coverage type so you get the right policy,
              not just a quote.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/find-agent"
                className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-black text-lg px-10 py-5 rounded-full no-underline transition-all hover:-translate-y-1 shadow-2xl"
              >
                Get Matched in 60 Seconds
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

      {/* ── COVERAGE GRID ───────────────────────────────────── */}
      <section id="categories" className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="inline-block text-brand-gold font-bold text-sm uppercase tracking-[0.2em] mb-4">
                Full Spectrum Protection
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-brand-navy">
                What would you like to insure today?
              </h2>
            </div>
            <p className="text-slate-500 text-lg max-w-sm">
              From personal assets to business liabilities, we have a licensed
              specialist ready to help.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.code}
                href={`/find-agent?category=${cat.code}`}
                className="group p-8 bg-slate-50 border border-slate-100 hover:border-brand-gold/30 rounded-3xl no-underline transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
                {/* <div className="text-5xl mb-6 relative z-10">{cat.icon}</div> */}
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 mb-6 relative z-10"
                />
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-2xl text-brand-navy mb-3 group-hover:text-brand-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-2 text-brand-navy font-black text-sm uppercase tracking-wider">
                    Get Matched
                    <span className="transform group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 md:py-32 bg-brand-navy text-white relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block text-brand-gold font-bold text-sm uppercase tracking-[0.2em] mb-4">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">
              How It Works
            </h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={s.step} className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-heading font-black text-3xl text-brand-gold mx-auto rotate-3 group-hover:rotate-0 transition-transform">
                    {s.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[120%] w-24 h-px bg-linear-to-r from-brand-gold/50 to-transparent" />
                  )}
                </div>
                <h3 className="text-2xl font-heading font-bold">{s.title}</h3>
                <p className="text-white/60 leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="inline-block text-brand-gold font-bold text-sm uppercase tracking-[0.2em] mb-4">
                The Standard for Trust
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-brand-navy mb-8 leading-tight">
                Why thousands of Americans trust our marketplace.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                In an industry full of generic call centers and confusing
                quotes, we prioritize local expertise and state-licensed
                professional matching.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {trustPoints.map((tp) => (
                  <div key={tp.title} className="flex flex-col gap-3">
                    <span className="text-3xl">{tp.icon}</span>
                    <h4 className="font-heading font-bold text-brand-navy text-xl">
                      {tp.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {tp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-brand-gold/10 rounded-[3rem] rotate-2" />
              <div className="relative bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      FL
                    </div>
                    <div>
                      <div className="font-heading font-bold text-brand-navy text-xl">
                        Expanding Nationwide
                      </div>
                      <div className="text-slate-400 text-sm italic">
                        &quot;Serving clients across Florida and beyond&quot;
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <blockquote className="text-slate-600 italic leading-relaxed">
                      &quot;I was tired of getting 20 calls from different
                      agents. Here I was matched with one specialist who
                      actually knew my county&apos;s specific requirements.
                      Highly recommend.&quot;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="flex text-brand-gold">★★★★★</div>
                      <span className="font-bold text-brand-navy">
                        — Sarah Jenkins, Homeowner
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/find-agent"
                    className="block text-center bg-brand-navy hover:bg-slate-800 text-white font-black py-4 rounded-2xl no-underline transition-all shadow-xl hover:shadow-2xl"
                  >
                    Start Your Search Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
