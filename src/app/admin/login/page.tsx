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
import * as Yup from "yup";
import { useFormik } from "formik";
import { adminRoute } from "@/lib/data/static";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        router.push(adminRoute);
        router.refresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Login failed";
        setStatus(message);
      } finally {
        setSubmitting(false);
      }
    },
  });
  const emailError = formik.touched.email && formik.errors.email;
  const passwordError = formik.touched.password && formik.errors.password;

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

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Server-side / submit error */}
            {formik.status && (
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-tight">
                  {formik.status}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="relative group">
                  <User
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      emailError
                        ? "text-red-400"
                        : "text-slate-500 group-focus-within:text-brand-gold"
                    }`}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="EMAIL"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-slate-800/50 border rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:outline-none focus:bg-slate-800 transition-all tracking-widest ${
                      emailError
                        ? "border-red-500/40 focus:border-red-500/60"
                        : "border-white/5 focus:border-brand-gold/30"
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider pl-4">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="relative group">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      passwordError
                        ? "text-red-400"
                        : "text-slate-500 group-focus-within:text-brand-gold"
                    }`}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-slate-800/50 border rounded-2xl py-4 pl-12 pr-12 text-white text-xs font-bold focus:outline-none focus:bg-slate-800 transition-all tracking-widest ${
                      passwordError
                        ? "border-red-500/40 focus:border-red-500/60"
                        : "border-white/5 focus:border-brand-gold/30"
                    }`}
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
                {passwordError && (
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider pl-4">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-slate-950 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
            >
              {formik.isSubmitting ? (
                <Activity className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                <>
                  Login
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
