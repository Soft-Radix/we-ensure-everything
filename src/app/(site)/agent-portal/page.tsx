import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Zap,
  ShieldCheck,
  Users,
  MousePointer2,
  Smartphone,
  LineChart,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function AgentPortalPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-brand-blue/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-blue pt-24 pb-20 text-white lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="container relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in-up text-4xl font-black leading-18 sm:text-5xl lg:text-6xl">
              Everything an Insurance Agent Needs to Generate Leads, Automate
              Follow-Up, and Grow Smarter
            </h1>
            <p className="mt-8 animate-fade-in text-lg leading-relaxed text-blue-50/90 sm:text-xl">
              AgentPro! combines a proprietary referral network, centralized
              digital lead generation, and a complete CRM automation platform
              into one system built for insurance agents.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={"/add-agent-828053"}
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-brand-orange/90"
              >
                Get Started Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#value-stack"
                className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Outcomes Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="animate-fade-in-up rounded-3xl bg-blue-50/50 p-8 text-center transition-all hover:shadow-xl hover:shadow-blue-900/5">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-brand-navy">
                More Qualified Opportunities
              </h3>
              <p className="text-slate-600">
                Stop chasing cold leads and start working with prospects who are
                actually ready to buy.
              </p>
            </div>
            <div className="animate-fade-in-up rounded-3xl bg-blue-50/50 p-8 text-center transition-all hover:shadow-xl hover:shadow-blue-900/5 [animation-delay:100ms]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-brand-navy">
                Better Follow-Up & Close Rates
              </h3>
              <p className="text-slate-600">
                Our automated systems ensure no deal slips through the cracks,
                ever.
              </p>
            </div>
            <div className="animate-fade-in-up rounded-3xl bg-blue-50/50 p-8 text-center transition-all hover:shadow-xl hover:shadow-blue-900/5 [animation-delay:200ms]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-brand-navy">
                Professional Client Experience
              </h3>
              <p className="text-slate-600">
                Look like a top-tier agency with a modern, tech-enabled presence
                from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black text-brand-navy sm:text-4xl">
              The 3 Key Problems We Solve
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-brand-orange"></div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Problem 1 */}
            <div className="rounded-4xl flex flex-col gap-8 bg-white p-8 shadow-sm lg:p-12">
              <div className="flex-1">
                <div className="mb-6 flex items-center gap-3 text-red-600">
                  <XCircle className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wider text-sm">
                    The Problem
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-brand-navy">
                  Agents lose money without qualified opportunities
                </h3>
                <p className="text-slate-600">
                  Most agents rely on inconsistent prospecting, stale purchased
                  leads, or a weak personal network. That creates dry months,
                  random production, and wasted time chasing ghosts.
                </p>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="flex-1">
                <div className="mb-6 flex items-center gap-3 text-brand-accent-green">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wider text-sm">
                    AgentPro! Solution
                  </span>
                </div>
                <h4 className="mb-4 text-xl font-bold text-brand-navy">
                  Built-in Referral & Lead Engine
                </h4>
                <p className="text-slate-600">
                  Get warm referrals from ReferralPro! and inbound prospects
                  from WeInsureEverything.com social campaigns routed directly
                  into your pipeline.
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="rounded-4xl flex flex-col gap-8 bg-white p-8 shadow-sm lg:p-12">
              <div className="flex-1">
                <div className="mb-6 flex items-center gap-3 text-red-600">
                  <XCircle className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wider text-sm">
                    The Problem
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-brand-navy">
                  Deals slip through the cracks due to manual follow-up
                </h3>
                <p className="text-slate-600">
                  Leads aren&apos;t contacted fast enough, not nurtured
                  consistently, and not tracked in one place. That kills
                  response time, appointment rates, and close rates.
                </p>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="flex-1">
                <div className="mb-6 flex items-center gap-3 text-brand-accent-green">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-wider text-sm">
                    AgentPro! Solution
                  </span>
                </div>
                <h4 className="mb-4 text-xl font-bold text-brand-navy">
                  One Automated Sales System
                </h4>
                <p className="text-slate-600">
                  One platform to capture, nurture, and convert leads
                  automatically with SMS, email, funnels, and 2-way
                  communication workflows.
                </p>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="rounded-4xl flex flex-col gap-8 bg-white p-8 shadow-sm lg:p-12 lg:col-span-2">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                <div>
                  <div className="mb-6 flex items-center gap-3 text-red-600">
                    <XCircle className="h-6 w-6" />
                    <span className="font-bold uppercase tracking-wider text-sm">
                      The Problem
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-brand-navy">
                    Agents look fragmented instead of professional
                  </h3>
                  <p className="text-slate-600">
                    Juggling separate tools for websites, texting, scheduling,
                    and reporting leads to a messy client experience, weak
                    branding, and wasted time.
                  </p>
                </div>
                <div>
                  <div className="mb-6 flex items-center gap-3 text-brand-accent-green">
                    <CheckCircle2 className="h-6 w-6" />
                    <span className="font-bold uppercase tracking-wider text-sm">
                      AgentPro! Solution
                    </span>
                  </div>
                  <h4 className="mb-4 text-xl font-bold text-brand-navy">
                    A Modern Brand Experience
                  </h4>
                  <p className="text-slate-600">
                    Get a tech-enabled presence with an NFC e-business card,
                    custom mobile app, QR codes, and centralized management
                    tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Solutions Grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-black text-brand-navy sm:text-4xl mb-4">
              Sharper Solutions for Faster Growth
            </h2>
            <p className="text-lg text-slate-600">
              We don&apos;t just give you tools; we give you a complete growth
              infrastructure.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sol 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:border-brand-blue/20 hover:shadow-2xl hover:shadow-blue-900/5">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-brand-navy">
                Generate More Opportunities
              </h3>
              <p className="mb-6 text-slate-600">
                Get warm referrals from non-competing insurance agents and
                inbound leads from centralized digital marketing.
              </p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  ReferralPro! Network
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  WeInsureEverything.com Leads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  Social Lead Generation
                </li>
              </ul>
            </div>

            {/* Sol 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:border-brand-blue/20 hover:shadow-2xl hover:shadow-blue-900/5">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
                <MousePointer2 className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-brand-navy">
                Convert More Prospects
              </h3>
              <p className="mb-6 text-slate-600">
                Automate follow-up, organize every conversation, and manage your
                sales pipeline from one dashboard.
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  Websites & Funnels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  Automated SMS/Email/Voicemail
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  2-Way Text & Email
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  Appointment Scheduling
                </li>
              </ul>
            </div>

            {/* Sol 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:border-brand-blue/20 hover:shadow-2xl hover:shadow-blue-900/5">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-brand-navy">
                Look Bigger. Move Faster.
              </h3>
              <p className="mb-6 text-slate-600">
                Give prospects a modern, professional experience with your own
                digital tools and mobile access.
              </p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  NFC e-Business Card
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  Custom Mobile App
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-accent-green" />{" "}
                  Personal QR Codes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack & Pricing */}
      <section
        id="value-stack"
        className="bg-brand-navy py-24 text-white lg:py-32"
      >
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-black sm:text-4xl lg:text-5xl">
                The AgentPro! Value Stack
              </h2>
              <p className="mb-10 text-xl text-blue-100/70">
                Everything you need to grow, bundled into one simple price.
              </p>

              <div className="space-y-6">
                {[
                  {
                    name: "ReferralPro! proprietary referral network",
                    val: "$150/mo value",
                  },
                  {
                    name: "Nationwide search & social lead campaign",
                    val: "$500/mo value",
                  },
                  {
                    name: "CRM, funnels, automations, and reporting",
                    val: "$297/mo value",
                  },
                  {
                    name: "NFC card, QR code, and brand assets",
                    val: "$150+/mo value",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/10 pb-4"
                  >
                    <span className="text-lg">{item.name}</span>
                    <span className="font-bold text-brand-orange">
                      {item.val}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 text-2xl font-black">
                  <span>Total Monthly Value</span>
                  <span className="text-brand-orange">$1,097+/mo</span>
                </div>
              </div>

              <div className="mt-12 rounded-3xl bg-white/5 p-8 border border-white/10">
                <p className="text-lg leading-relaxed italic text-blue-50">
                  &quot;Over $1,097/month in combined software, lead generation,
                  and growth tools — included in AgentPro!&quot;
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-4xl bg-white p-10 text-brand-navy shadow-2xl">
                <div className="mb-8 text-center">
                  <span className="rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-brand-blue">
                    Limited Time Offer
                  </span>
                  <h3 className="mt-4 text-3xl font-black">
                    Start Growing Today
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Monthly */}
                  <div className="rounded-2xl border-2 border-slate-100 p-6 transition-all hover:border-brand-blue">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-500">Monthly Plan</p>
                        <p className="text-4xl font-black text-brand-navy">
                          $400
                          <span className="text-lg font-normal text-slate-400">
                            /mo
                          </span>
                        </p>
                      </div>
                      <Link
                        href={"/add-agent-828053"}
                        className="rounded-full bg-brand-blue px-6 py-3 font-bold text-white transition-all hover:bg-brand-blue-dark"
                      >
                        Select
                      </Link>
                    </div>
                  </div>

                  {/* Annual */}
                  <div className="relative rounded-2xl border-2 border-brand-orange bg-brand-orange/5 p-6 shadow-lg shadow-brand-orange/10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-widest text-white rounded-full">
                      Best Value - Save 50%
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-brand-orange">
                          Annual Billing
                        </p>
                        <p className="text-4xl font-black text-brand-navy">
                          $200
                          <span className="text-lg font-normal text-slate-400">
                            /mo
                          </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Billed annually at $2,400/yr
                        </p>
                      </div>
                      <Link
                        href={"/add-agent-828053"}
                        className="rounded-full bg-brand-orange px-6 py-3 font-bold text-white transition-all hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/20"
                      >
                        Select
                      </Link>
                    </div>
                  </div>
                </div>

                <ul className="mt-10 space-y-4">
                  {[
                    "Everything in the AgentPro! stack",
                    "Immediate access to ReferralPro!",
                    "Centralized lead dashboard",
                    "24/7 Premium Support",
                    "Cancel anytime",
                  ].map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-slate-600"
                    >
                      <CheckCircle2 className="h-5 w-5 text-brand-accent-green" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="mb-8 text-3xl font-black text-brand-navy sm:text-4xl">
            Ready to automate your insurance growth?
          </h2>
          <Link
            href={"/add-agent-828053"}
            className="group inline-flex items-center gap-3 rounded-full bg-brand-blue px-10 py-5 text-xl font-bold text-white transition-all hover:scale-105 hover:bg-brand-blue-dark"
          >
            Launch Your AgentPro! System
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
          </Link>
          <p className="mt-6 text-slate-400">
            Join hundreds of agents scaling their agencies with AgentPro!
          </p>
        </div>
      </section>
    </div>
  );
}
