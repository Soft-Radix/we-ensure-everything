import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import React from "react";

const Pagination = ({ page, total, setPage }: any) => {
  const totalPages = Math.ceil(total / 10);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded-xl cursor-pointer border border-slate-100 bg-white text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="flex items-center gap-1.5 px-2">
        {getPageNumbers().map((p, index) => {
          if (p === "...") {
            return (
              <div
                key={`dots-${index}`}
                className="w-8 h-8 flex items-center justify-center text-slate-300"
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            );
          }

          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer border ${
                isCurrent
                  ? "bg-brand-navy text-brand-gold border-brand-navy shadow-lg shadow-brand-navy/10 scale-110 z-10"
                  : "bg-white text-slate-400 border-slate-100 hover:border-brand-gold/30 hover:text-brand-gold"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl border cursor-pointer border-slate-100 bg-white text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm group"
      >
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default Pagination;
