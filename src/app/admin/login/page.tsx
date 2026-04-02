"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  User,
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl shadow-black/40">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold rounded-2xl shadow-xl shadow-brand-gold/20 mb-6 group cursor-default">
              <ShieldCheck className="w-8 h-8 text-slate-900 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic underline decoration-brand-gold decoration-2 underline-offset-8">
              AgentPro
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-4">
              Authorized Administrative Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-tight">
                  {error}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:outline-none focus:border-brand-gold/30 focus:bg-slate-800 transition-all uppercase tracking-widest"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white text-xs font-bold focus:outline-none focus:border-brand-gold/30 focus:bg-slate-800 transition-all uppercase tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-slate-950 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
            >
              {loading ? (
                <Activity className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                <>
                  Establish Connection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
              Powered by AgentPro Multi-Seat Infrastructure
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                End-to-End Encryption Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
