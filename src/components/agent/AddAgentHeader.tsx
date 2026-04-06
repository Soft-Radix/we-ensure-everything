import { Check } from "lucide-react";
import React from "react";

const AddAgentHeader = ({ step }: { step: number }) => {
  return (
    <div>
      {/* Progress Bar */}
      <div className="flex border-b border-slate-100">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 py-6 px-4 text-center transition-all ${step === s ? "bg-brand-gold/5 border-b-2 border-brand-gold" : "border-b-2 border-transparent opacity-50"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold ${step === s ? "bg-brand-gold text-brand-navy" : "bg-slate-200 text-slate-500"}`}
            >
              {step > s ? <Check size={16} /> : s}
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${step === s ? "text-brand-navy" : "text-slate-400"}`}
            >
              Step {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddAgentHeader;
