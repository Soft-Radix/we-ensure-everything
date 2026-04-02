import { getSession } from "@/lib/auth";
import React from "react";

const Header = async () => {
  const session = await getSession();
  return (
    <div>
      {/* Dynamic Header / Breadcrumbs */}
      <div
        className="h-16 px-8 py-8 flex items-center justify-between sticky top-0 
  bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-40"
      >
        {/* LEFT: Breadcrumb */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium text-xs tracking-wide uppercase">
            System
          </span>

          <span className="text-slate-300 text-sm">/</span>

          <span className="text-slate-900 font-semibold text-sm tracking-wide">
            {session?.role === "superadmin" ? "Super Admin" : "Admin"}
          </span>
        </div>

        {/* RIGHT: User + Status */}
        <div className="flex items-center gap-5">
          {/* Status */}
          <div
            className="flex items-center gap-2 text-xs font-semibold 
      text-emerald-600 bg-emerald-50 border border-emerald-100 
      px-3 py-1.5 rounded-full shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* User Info */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br 
        from-indigo-500 to-purple-600 flex items-center justify-center 
        text-white text-xs font-bold shadow-md"
            >
              {session?.username?.charAt(0).toUpperCase()}
            </div>

            {/* Name + Role */}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-800">
                {session?.username}
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                {session?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
