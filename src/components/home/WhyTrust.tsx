import { trustPoints } from "@/lib/data/static";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const WhyTrust = () => {
  return (
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
              In an industry full of generic call centers and confusing quotes,
              we prioritize local expertise and state-licensed professional
              matching.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {trustPoints.map((tp) => (
                <div key={tp.title} className="flex flex-col gap-3">
                  <span className="text-3xl">
                    <Image
                      src={tp.icon}
                      alt={tp.title}
                      width={500}
                      height={500}
                      className="object-cover rounded-2xl h-[150px] w-[400px]"
                    />
                  </span>
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
                  <div className="w-16 h-16 shrink-0 bg-brand-navy rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
                    &quot;I was tired of getting 20 calls from different agents.
                    Here I was connected with one specialist who actually knew
                    my county&apos;s specific requirements. Highly
                    recommend.&quot;
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
                  Find Your In-Town Agent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTrust;
