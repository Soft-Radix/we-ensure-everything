import { categories } from "@/lib/data/static";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CoverageSection = () => {
  return (
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
          {categories.map((cat, idx) => (
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
                priority={idx < 3}
              />
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl text-brand-navy mb-3 group-hover:text-brand-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-2 text-brand-navy font-black text-sm uppercase tracking-wider">
                  Meet Local Agent
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
  );
};

export default CoverageSection;
