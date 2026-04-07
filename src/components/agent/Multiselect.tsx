import { MultiSelectProps } from "@/lib/data/agentTypes";
import { Check } from "lucide-react";
import { useState } from "react";

const MultiSelect = ({
  label,
  options,
  selected,
  onChange,
  error,
  placeholder,
  showSelectAll,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const isAllSelected =
    options.length > 0 && options.every((opt) => selected.includes(opt.value));

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Remove all current options from selection
      const optionValues = options.map((o) => o.value);
      onChange(selected.filter((val) => !optionValues.includes(val)));
    } else {
      // Add all current options to selection
      const optionValues = options.map((o) => o.value);
      const newSelected = Array.from(new Set([...selected, ...optionValues]));
      onChange(newSelected);
    }
  };

  return (
    <div className="relative mb-6">
      <label className="block text-slate-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div
        className={`min-h-[50px] pr-2 pl-3 py-4 border rounded-xl bg-white truncate gap-2 cursor-pointer transition-all ${isOpen ? "ring-2 ring-brand-gold border-brand-gold" : "border-slate-200 hover:border-slate-300"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span className="text-slate-400 p-1">
            {placeholder || "Select options..."}
          </span>
        )}
        {selected.map((val) => (
          <span
            key={val}
            className="inline-flex items-center gap-1 bg-brand-gold/10 text-brand-navy px-3 py-1 rounded-full text-xs font-bold border border-brand-gold/20 mr-1"
          >
            {options.find((o) => o.value === val)?.label || val}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleOption(val);
              }}
              className="hover:text-brand-gold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-2xl max-h-52 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white space-y-2">
            <input
              autoFocus
              type="text"
              className="w-full p-2 text-sm border border-slate-100 rounded-lg focus:ring-0 outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {showSelectAll && options.length > 0 && (
              <div
                className="flex items-center justify-between px-2 pb-1 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
              >
                <span className="text-xs font-bold text-brand-navy/60 group-hover:text-brand-navy">
                  {isAllSelected ? "Deselect All" : "Select All"}
                </span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isAllSelected ? "bg-brand-gold border-brand-gold" : "border-slate-300 bg-white"}`}
                >
                  {isAllSelected && <Check size={10} className="text-white" />}
                </div>
              </div>
            )}
          </div>
          <div className="overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-sm">
                No options found
              </div>
            )}
            {filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className={`p-3 text-sm cursor-pointer hover:bg-slate-50 flex items-center justify-between ${selected.includes(opt.value) ? "bg-brand-gold/5 text-brand-navy font-bold" : "text-slate-600"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
                {selected.includes(opt.value) && (
                  <Check size={14} className="text-brand-gold" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1 absolute">{error}</p>}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
export default MultiSelect;
