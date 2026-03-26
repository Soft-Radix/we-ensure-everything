import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Auto & Vehicle", href: "/find-agent?category=AUTO_VEHICLE" },
  {
    name: "Property & Casualty",
    href: "/find-agent?category=PROPERTY_CASUALTY",
  },
  { name: "Health", href: "/find-agent?category=HEALTH" },
  { name: "Life & Disability", href: "/find-agent?category=LIFE_DISABILITY" },
  {
    name: "Business & Commercial",
    href: "/find-agent?category=BUSINESS_COMMERCIAL",
  },
  { name: "Niche & Specialty", href: "/find-agent?category=NICHE_SPECIALTY" },
];

const quickLinks = [
  { name: "Find an Agent", href: "/find-agent" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Agent Portal", href: "/agent-portal" },
  { name: "About Us", href: "/#about" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col no-underline group">
              <Image
                src="/icons/header.png"
                alt="Logo"
                width={180}
                height={180}
                className=""
              />
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mt-1 ml-0.5">
                A Nationwide Insurance Marketplace
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Connecting consumers with licensed, vetted insurance agents across
              all 3,143 U.S. counties.
            </p>
          </div>

          {/* Coverage */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-brand-gold mb-6">
              Coverage Types
            </h4>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="text-white/70 hover:text-brand-gold text-sm no-underline transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-brand-gold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-white/70 hover:text-brand-gold text-sm no-underline transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-brand-gold mb-6">
              Trust & Compliance
            </h4>
            <p className="text-white/60 text-[11px] leading-relaxed mb-4">
              We Insure Everything is a marketing platform connecting consumers
              with licensed insurance agents. We are not an insurance carrier.
            </p>
            <p className="text-white/60 text-[11px] leading-relaxed mb-4">
              Our agents are licensed in their respective states. Coverage options
              are also provided by licensed professionals and carriers.
            </p>
            <div className="flex gap-4 items-center opacity-50">
              <span className="text-2xl">🔒</span>
              <span className="text-2xl">🛡️</span>
              <span className="text-2xl">🇺🇸</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">
              © {new Date().getFullYear()} We Insure Everything · A Nationwide
              Insurance Marketplace
            </p>
            <p className="text-white/30 text-[10px]">
              Availability varies by state. All trademarks are the property of
              their respective owners.
            </p>
          </div>
          <p className="text-white/20 text-[10px]">
            Powered by AgentPro! & ReferralPro!
          </p>
        </div>
      </div>
    </footer>
  );
}
