import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Pagination = ({ page, total, setPage }: any) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 mx-4">
        <span className="text-xs font-black text-brand-navy italic underline decoration-brand-gold decoration-2 underline-offset-4">
          {page}
        </span>
        <span className="text-xs font-bold text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-400 italic">
          {Math.ceil(total / 10)}
        </span>
      </div>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page * 10 >= total}
        className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
