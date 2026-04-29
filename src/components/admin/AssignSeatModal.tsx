"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, AlertCircle, Loader2, MapPin, Tag } from "lucide-react";
import toast from "react-hot-toast";
import SingleSelect from "@/components/agent/SingleSelect";

interface Category {
  id: number;
  code: string;
  name: string;
  products?: { id: number; code: string; name: string }[];
}

interface State {
  id: number;
  code: string;
  name: string;
}

interface County {
  id: number;
  name: string;
  state_abbr: string;
}

interface AssignSeatModalProps {
  agent: { id: number; full_name: string };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignSeatModal({
  agent,
  isOpen,
  onClose,
  onSuccess,
}: AssignSeatModalProps) {
  const [states, setStates] = useState<State[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflicts, setConflicts] = useState<any[] | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStates();
      fetchCategories();
      setConflicts(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedState) {
      fetchCounties(selectedState);
    } else {
      setCounties([]);
    }
    setSelectedCounty("");
  }, [selectedState]);

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const res = await fetch("/api/states");
      const data = await res.json();
      setStates(data.states || []);
    } catch (error) {
      console.error("Failed to fetch states", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCounties = async (stateAbbr: string) => {
    setLoadingCounties(true);
    try {
      const res = await fetch(`/api/counties?state=${stateAbbr}&limit=1000`);
      const data = await res.json();
      setCounties(data.counties || []);
    } catch (error) {
      console.error("Failed to fetch counties", error);
    } finally {
      setLoadingCounties(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedCounty || !selectedCategory) {
      toast.error("Please select all fields");
      return;
    }

    setIsSubmitting(true);
    setConflicts(null);
    try {
      const res = await fetch("/api/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          countyId: parseInt(selectedCounty),
          categoryId: parseInt(selectedCategory),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Seats assigned successfully");
        onSuccess();
        onClose();
      } else {
        if (data.conflicts) {
          setConflicts(data.conflicts);
        } else {
          toast.error(data.error || "Failed to assign seats");
        }
      }
    } catch (error) {
      console.error("Assignment error", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const stateOptions = states.map((s) => ({
    label: `${s.name} (${s.code})`,
    value: s.code,
  }));
  const countyOptions = counties.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-brand-navy tracking-tight italic">
              Manual{" "}
              <span className="text-brand-gold">Category Assignment</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
              Agent: {agent.full_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-brand-navy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* State & County Selection */}
          <div className="grid grid-cols-2 gap-4">
            <SingleSelect
              label="Select State"
              placeholder="Choose State"
              options={stateOptions}
              value={selectedState}
              onChange={setSelectedState}
            />

            <SingleSelect
              label="Select County"
              placeholder={loadingCounties ? "Loading..." : "Choose County"}
              options={countyOptions}
              value={selectedCounty}
              onChange={setSelectedCounty}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag className="w-3 h-3" /> Select Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id.toString());
                  }}
                  className={`px-4 py-3 rounded-xl cursor-pointer border text-left transition-all ${
                    selectedCategory === cat.id.toString()
                      ? "bg-brand-navy border-brand-navy text-white shadow-lg shadow-brand-navy/20"
                      : "bg-white border-slate-100 text-slate-600 hover:border-brand-gold/30 hover:bg-brand-gold/5"
                  }`}
                >
                  <p className="text-xs font-black tracking-tight">
                    {cat.name}
                  </p>
                  <p
                    className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                      selectedCategory === cat.id.toString()
                        ? "text-brand-gold"
                        : "text-slate-400"
                    }`}
                  >
                    {cat.code}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Warning/Info */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 mt-6">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              Manually assigning a category will grant this agent immediate
              access to <b>all products</b> within that category for the
              selected area.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-end gap-4 bg-slate-50/30">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={isSubmitting || !selectedCategory || !selectedCounty}
            className="bg-brand-navy hover:bg-slate-800 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-black text-sm tracking-wide gap-2 flex items-center transition-all shadow-xl hover:shadow-brand-navy/20 transform hover:-translate-y-0.5 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-brand-gold" />
                Confirm Assignment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conflict Popup */}
      {conflicts && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
            onClick={() => setConflicts(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-red-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-red-600 tracking-tight flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Conflicts Detected
                </h3>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-0.5">
                  The following seats are already occupied
                </p>
              </div>
              <button
                onClick={() => setConflicts(null)}
                className="p-2 hover:bg-white rounded-xl transition-all text-red-300 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {conflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-brand-navy uppercase tracking-wider">
                        {conflict.product}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-brand-navy font-black text-sm shadow-sm group-hover:bg-red-50 transition-colors">
                        {conflict.agent.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-navy leading-none">
                          {conflict.agent.full_name}
                        </p>
                        <div className="flex flex-col gap-0.5 mt-1.5">
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 leading-none">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            {conflict.agent.email}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 leading-none">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            {conflict.agent.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-center bg-slate-50/50">
              <button
                onClick={() => setConflicts(null)}
                className="w-full py-3 bg-brand-navy text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-brand-navy/20 active:scale-95"
              >
                Close and Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
