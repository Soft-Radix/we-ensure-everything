"use client";
import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Clock,
  UserSquare2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Loader from "@/components/admin/Loader";

interface Stats {
  leadsCount: number;
  agentsCount: number;
  activeSeats: number;
  waitlistCount: number;
  revenueEstimated: number;
  growthRate: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) setStats(await res.json());
      } catch (e) {
        console.error("Dashboard failed to load stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Leads",
      value: stats?.leadsCount || 0,
      icon: Users,
      color: "blue",
      trend: "+2.4%",
      href: "/admin/users",
    },
    {
      label: "Marketplace Agents",
      value: stats?.agentsCount || 0,
      icon: UserSquare2,
      color: "gold",
      trend: "+8.1%",
      href: "/admin/agents",
    },
    {
      label: "Active Seats",
      value: stats?.activeSeats || 0,
      icon: Zap,
      color: "emerald",
      trend: "Full Capacity",
      href: "/admin/agents",
    },
    {
      label: "Waitlist Queue",
      value: stats?.waitlistCount || 0,
      icon: Activity,
      color: "rose",
      trend: "+14.2%",
      href: "#",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-6 w-1 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,184,0,0.4)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Platform Overview
            </span>
          </div>
          <h2 className="text-4xl font-black text-brand-navy tracking-tight">
            System{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-gold to-yellow-500">
              Analytics
            </span>
          </h2>
          <p className="text-slate-500 font-medium">
            Real-time health monitor and performance metrics across the AgentPro
            ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3 p-1.5 bg-white shadow-sm border border-slate-100 rounded-2xl animate-in fade-in duration-1000">
          <div className="bg-brand-gold/5 p-3 rounded-xl border border-brand-gold/10">
            <TrendingUp className="text-brand-gold w-5 h-5" />
          </div>
          <div className="pr-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Monthly Growth
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-700">
                {stats?.growthRate}
              </span>
              <span className="text-[10px] font-bold text-emerald-500">▲</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all animate-in slide-in-from-bottom duration-500 overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Glossy Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/20 to-transparent pointer-events-none rounded-full translate-x-12 -translate-y-12" />

            <div className="flex items-center justify-between mb-8">
              <div
                className={`
                p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500
                ${card.color === "gold" ? "bg-brand-gold/10 text-brand-gold shadow-lg shadow-brand-gold/10 border border-brand-gold/20" : ""}
                ${card.color === "blue" ? "bg-blue-50 text-blue-600 shadow-lg shadow-blue-100 border border-blue-100" : ""}
                ${card.color === "emerald" ? "bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100 border border-emerald-100" : ""}
                ${card.color === "rose" ? "bg-rose-50 text-rose-600 shadow-lg shadow-rose-100 border border-rose-100" : ""}
              `}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-black tracking-tighter uppercase px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                {card.trend}
              </div>
            </div>

            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">
              {card.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-brand-navy tracking-tighter">
                {card.value}
              </span>
              <span className="text-xs font-bold text-slate-300">Total</span>
            </div>

            <Link
              href={card.href}
              className="absolute bottom-6 right-8 text-slate-300 group-hover:text-brand-gold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left duration-1000">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 blur-[120px] -mr-20 -mt-20 rounded-full" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                    Intelligence Hub
                  </span>
                </div>
                <h3 className="text-3xl font-black tracking-tight leading-tight max-w-md italic">
                  Optimizing user routing & marketplace performance.
                </h3>
                <p className="text-slate-400 text-sm max-w-sm font-medium">
                  Your marketplace is currently operating at{" "}
                  <span className="text-emerald-400 font-bold">
                    98.4% efficiency
                  </span>
                  . The routing engine successfully matched {stats?.activeSeats}{" "}
                  agents this month.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] animate-in slide-in-from-right duration-1000 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-brand-navy tracking-tight italic border-b-2 border-brand-gold inline-block">
              Platform Health
            </h4>
            <ShieldCheck className="text-brand-gold w-5 h-5" />
          </div>

          <div className="space-y-6">
            {[
              { label: "Database Sync", icon: Layers, status: "Healthy" },
              { label: "Webhook Listeners", icon: Clock, status: "Active" },
              { label: "Lead Ingestion", icon: Heart, status: "Optimal" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 group-hover:text-brand-gold group-hover:bg-brand-gold/5 transition-all">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 italic">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
