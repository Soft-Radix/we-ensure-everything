"use client";

import { SingleSelectProps } from "@/lib/data/agentTypes";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const SingleSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
}: SingleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const listboxId = `single-select-listbox-${uid}`;

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  const handleOpen = () => {
    setIsOpen(true);
    // let the dropdown render, then focus the search input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative mb-6" ref={containerRef}>
      <label className="block text-slate-700 font-semibold mb-2 text-sm">
        {label}
      </label>

      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen();
          if (e.key === "Escape") setIsOpen(false);
        }}
        className={`min-h-[50px] px-3 py-2 border rounded-xl bg-white flex items-center justify-between gap-2 cursor-pointer transition-all select-none ${
          isOpen
            ? "ring-2 ring-brand-gold border-brand-gold"
            : "border-slate-200 hover:border-slate-300"
        }`}
        onClick={handleOpen}
      >
        <span
          className={`text-sm flex-1 truncate ${value ? "text-slate-800 font-medium" : "text-slate-400"}`}
        >
          {value ? selectedLabel : (placeholder ?? "Select an option...")}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-slate-100 bg-white sticky top-0">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold placeholder-slate-400"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options */}
          <ul id={listboxId} role="listbox" className="overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <li className="p-4 text-center text-slate-400 text-sm">
                No options found
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    opt.value === value
                      ? "bg-brand-gold/10 text-brand-navy font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                >
                  {opt.label}
                  {opt.value === value && (
                    <Check size={14} className="text-brand-gold shrink-0" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1 absolute">{error}</p>}
    </div>
  );
};

export default SingleSelect;
