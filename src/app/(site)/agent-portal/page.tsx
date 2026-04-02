import Link from "next/link";

export default function AgentPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-[#0D5A8A] to-[#1378B2] text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1
            className="text-3xl md:text-4xl font-black mb-3"
            //
          >
            AgentPro! Portal
          </h1>
          <p className="text-white/80 text-lg">
            Manage your exclusive seat assignments and referrals
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "📍",
              title: "County Seats",
              desc: "View and manage your assigned county territories",
              badge: "Active",
              color: "emerald",
            },
            {
              icon: "📋",
              title: "Referral Queue",
              desc: "Review incoming consumer referrals assigned to you",
              badge: "New",
              color: "blue",
            },
            {
              icon: "⏳",
              title: "Waitlist Status",
              desc: "Track your waitlist positions across all counties",
              badge: null,
              color: "amber",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-900">{c.title}</h3>
                {c.badge && (
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${c.color === "emerald" ? "bg-emerald-100 text-emerald-700" : c.color === "blue" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {c.badge}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 text-center">
          <div className="text-5xl mb-6">🏗️</div>
          <h2 className="font-black text-2xl text-slate-900 mb-3">
            Agent Portal Coming Soon
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
            We&apos;re building a full dashboard for agent seat management,
            referral tracking, and GoHighLevel integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-agent"
              className="bg-[#1378B2] hover:bg-[#0D5A8A] text-white font-bold px-8 py-4 rounded-full no-underline transition-all"
            >
              Test Consumer Flow
            </Link>
            <Link
              href="/"
              className="border-2 border-[#1378B2] text-[#1378B2] hover:bg-[#E8F4FD] font-bold px-8 py-4 rounded-full no-underline transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
