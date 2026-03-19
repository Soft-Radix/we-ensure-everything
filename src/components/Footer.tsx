import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Commercial Insurance", href: "/find-agent?category=COMMERCIAL" },
  { name: "Health, Life & Disability", href: "/find-agent?category=HEALTH" },
  { name: "Personal Insurance", href: "/find-agent?category=PERSONAL" },
  { name: "Medicare & Senior", href: "/find-agent?category=MEDICARE" },
  { name: "Financial & Legal", href: "/find-agent?category=FINANCIAL" },
  { name: "Group Benefits", href: "/find-agent?category=GROUP" },
];

const quickLinks = [
  { name: "Find an Agent", href: "/find-agent" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Agent Portal", href: "/agent-portal" },
  { name: "About Us", href: "/#about" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D5A8A] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/15">
          {/* Brand */}
          <div>
            <Image
              src="/icons/header.png"
              alt="Logo"
              width={200}
              height={200}
            />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              A nationwide network of exclusive, licensed insurance specialists
              — one agent per county, per coverage.
            </p>
          </div>

          {/* Coverage */}
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest text-white/40 mb-5"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Coverage Types
            </h4>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="text-white/75 hover:text-[#F67B13] text-sm no-underline transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest text-white/40 mb-5"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-white/75 hover:text-[#F67B13] text-sm no-underline transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest text-white/40 mb-5"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Find Your Agent
            </h4>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Search by county to find a licensed specialist dedicated
              exclusively to your area.
            </p>
            <Link
              href="/find-agent"
              className="inline-flex items-center gap-2 bg-[#F67B13] hover:bg-[#D96608] text-white font-bold text-sm px-6 py-3 rounded-full no-underline transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Find My Agent →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} WeInsureEverything.com · Powered by
            AgentPro! &amp; ReferralPro!
          </p>
          <p className="text-white/30 text-xs">
            Built by SoftRadix Technologies Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
