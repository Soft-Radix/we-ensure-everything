import { Step } from "@/lib/data/categories";
import React from "react";

const StepIndicator = ({ current }: { current: Step }) => {
  const steps = ["Coverage", "Details", "Agent"];
  return (
    <div className="flex items-center gap-4 md:gap-12">
      {steps.map((label, i) => {
        const stepNum = (i + 1) as Step;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500
                  ${isDone ? "bg-brand-accent-green text-white shadow-lg" : ""}
                  ${isActive ? "bg-brand-gold text-brand-navy shadow-xl scale-110 ring-4 ring-brand-gold/20" : ""}
                  ${!isDone && !isActive ? "bg-slate-200 text-slate-400" : ""}`}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span
                className={`text-xs font-black uppercase tracking-widest hidden sm:block ${isActive ? "text-brand-navy" : "text-slate-400"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 rounded transition-all duration-500 ${isDone ? "bg-brand-accent-green" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
