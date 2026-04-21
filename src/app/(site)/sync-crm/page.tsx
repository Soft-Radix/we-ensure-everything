"use client";

import { useState } from "react";
import {
  Mail,
  Key,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { addKeySchema } from "@/lib/schema/agentSchema";
import { MaskedInput } from "@/components/agent/MaskedInput";

export default function AddKeyPage() {
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      apiKey: "",
      confirmApiKey: "",
    },
    validationSchema: addKeySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("/api/agents/add-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, apiKey: values.apiKey }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("API Key successfully added and encrypted");
          setSuccess(true);
        } else {
          toast.error(data.error || "Failed to add API key");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-4xl shadow-2xl p-10 border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-3xl mb-8 shadow-inner">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
          <h1 className="text-3xl font-heading font-black text-brand-navy mb-4">
            Success!
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your API key has been securely encrypted and added to your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-4 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl font-black transition-all hover:shadow-xl cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-3xl mb-6 shadow-inner">
            <Lock className="text-brand-gold" size={32} />
          </div>

          <p className="text-black text-lg max-w-sm mx-auto">
            Integrate your API key with us.
          </p>
        </div>

        <div className="bg-white rounded-4xl shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

          <div className="mb-8 p-6 bg-brand-navy/5 rounded-3xl border border-brand-navy/10 relative z-10">
            <p className="text-brand-navy font-bold text-sm mb-1 flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-gold" />
              Security First
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your API key will be encrypted before being stored. We take your
              data security seriously.
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-6 relative z-10"
          >
            <div>
              <label className="block text-slate-700 font-bold mb-3 text-sm ml-1 uppercase tracking-wider">
                Registered Agent Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-5 top-1/2 -translate-y-1/2 ${formik.touched.email && formik.errors.email ? "text-red-400" : "text-slate-400"}`}
                  size={20}
                />
                <input
                  name="email"
                  type="email"
                  className={`w-full pl-14 pr-6 py-5 rounded-2xl border ${formik.touched.email && formik.errors.email ? "border-red-200 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"} outline-none transition-all text-lg`}
                  placeholder="agent@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                  <AlertCircle size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {formik.errors.email}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-3 text-sm ml-1 uppercase tracking-wider">
                API Key
              </label>
              <div className="relative">
                <Key
                  className={`absolute left-5 top-1/2 -translate-y-1/2 ${formik.touched.apiKey && formik.errors.apiKey ? "text-red-400" : "text-slate-400"}`}
                  size={20}
                />
                <MaskedInput
                  name="apiKey"
                  className={`w-full pl-14 pr-14 py-5 rounded-2xl border ${formik.touched.apiKey && formik.errors.apiKey ? "border-red-200 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"} outline-none transition-all text-lg tracking-widest font-mono`}
                  placeholder="••••••••••••••••"
                  value={formik.values.apiKey}
                  onChange={(name, val) => formik.setFieldValue(name, val)}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.apiKey && formik.errors.apiKey && (
                <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                  <AlertCircle size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {formik.errors.apiKey}
                  </p>
                </div>
              )}
            </div>
            {/* 
            <div>
              <label className="block text-slate-700 font-bold mb-3 text-sm ml-1 uppercase tracking-wider">
                Confirm API Key
              </label>
              <div className="relative">
                <Key
                  className={`absolute left-5 top-1/2 -translate-y-1/2 ${formik.touched.confirmApiKey && formik.errors.confirmApiKey ? "text-red-400" : "text-slate-400"}`}
                  size={20}
                />
                <MaskedInput
                  name="confirmApiKey"
                  className={`w-full pl-14 pr-6 py-5 rounded-2xl border ${formik.touched.confirmApiKey && formik.errors.confirmApiKey ? "border-red-200 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"} outline-none transition-all text-lg tracking-widest font-mono`}
                  placeholder="••••••••••••••••"
                  value={formik.values.confirmApiKey}
                  onChange={(name, val) => formik.setFieldValue(name, val)}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.confirmApiKey && formik.errors.confirmApiKey && (
                <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                  <AlertCircle size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {formik.errors.confirmApiKey}
                  </p>
                </div>
              )}
            </div> */}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-5 cursor-pointer bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl font-black text-lg transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3 mt-4 shadow-xl shadow-brand-navy/10"
            >
              {formik.isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Encrypting & Saving...
                </>
              ) : (
                <>
                  Add Secure Key
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
