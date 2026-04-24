import Image from "next/image";
import { steps } from "@/lib/data/static";
import React from "react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 text-white overflow-hidden">
      {/* Background image — lazy loaded, below the fold */}
      <Image
        src="/images/works.png"
        alt=""
        fill
        loading="lazy"
        className="object-cover object-center"
        sizes="100vw"
        quality={75}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-[2]" />

      <div className="max-w-6xl mx-auto px-6 relative z-[3]">
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
                <div className="w-20 h-20 rounded-2xl bg-brand-gold border border-brand-navy flex items-center justify-center font-heading font-black text-3xl text-brand-navy mx-auto rotate-3 group-hover:rotate-0 transition-transform">
                  {s.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[120%] w-24 h-px bg-linear-to-r from-brand-gold/50 to-transparent" />
                )}
              </div>
              <h3 className="text-2xl font-heading font-bold">{s.title}</h3>
              <p className="text-white/80 leading-relaxed max-w-xs mx-auto">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
