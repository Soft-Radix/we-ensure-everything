"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  UserSquare2,
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useLoading } from "@/hooks/useLoading";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users (Leads)", href: "/admin/users", icon: Users },
  { label: "Agents", href: "/admin/agents", icon: UserSquare2 },
  //   { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const handleLogout = async () => {
    await withLoading(async () => {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    });
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl overflow-hidden">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center shadow-lg shadow-brand-gold/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
          <ShieldCheck className="text-slate-900 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold tracking-tight text-lg leading-tight uppercase italic underline decoration-brand-gold decoration-1 underline-offset-4">
            AgentPro
          </h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
            Admin Console
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 mt-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? "bg-brand-gold/10 text-brand-gold shadow-sm ring-1 ring-brand-gold/20"
                    : "hover:bg-slate-800/50 hover:text-white"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-brand-gold" : "text-slate-500 group-hover:text-slate-300"}`}
              />
              <span className="font-semibold text-sm tracking-wide">
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(255,184,0,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-slate-800/40 rounded-2xl p-4 mb-4 border border-slate-700/30">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br 
        from-indigo-500 to-purple-600 flex items-center justify-center 
        text-white text-xs font-bold shadow-md"
            >
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                Administrator
              </p>
              <p className="text-[10px] text-slate-500 truncate">System Root</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center cursor-pointer justify-center gap-2 py-2 px-3 rounded-lg bg-slate-700/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-bold transition-all border border-transparent hover:border-red-500/20 group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Logout Session
          </button>
        </div>
      </div>
      {showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-2">
                Confirm Logout
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to logout from this session?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 cursor-pointer py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleLogout();
                    setShowLogoutModal(false);
                  }}
                  disabled={isLoading}
                  className="px-4 cursor-pointer py-2 text-sm rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                >
                  {isLoading ? "Logging out..." : "Yes, Logout"}
                </button>
              </div>
            </div>
          </div>,
          document.body, // 👈 Renders outside <aside> entirely
        )}
    </aside>
  );
}
