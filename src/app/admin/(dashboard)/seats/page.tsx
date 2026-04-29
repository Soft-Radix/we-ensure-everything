"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Filter,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLoading } from "@/hooks/useLoading";
import Loader from "@/components/admin/Loader";
import SingleSelect from "@/components/agent/SingleSelect";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  code: string;
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

interface Seat {
  id: number;
  agent_id: number;
  county_id: number;
  category_id: number;
  product_id: number;
  Agent: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    plan_type: string;
  };
  County: {
    name: string;
    state_abbr: string;
  };
  Category: {
    name: string;
    code: string;
  };
  Product: {
    name: string;
    code: string;
  };
}

interface WaitlistEntry {
  id: number;
  agent_id: number;
  Agent: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
  };
  County: {
    name: string;
    state_abbr: string;
  };
  Category: {
    name: string;
  };
  Product: {
    name: string;
  };
  created_at: string;
}

export default function SeatsManagementPage() {
  const [activeTab, setActiveTab] = useState<"seats" | "waitlist">("seats");
  const { isLoading, withLoading } = useLoading();

  // Data
  const [seats, setSeats] = useState<Seat[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  // Filter Options
  const [states, setStates] = useState<State[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter Values
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loadingCounties, setLoadingCounties] = useState(false);

  useEffect(() => {
    fetchStates();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedState, selectedCounty, selectedCategory]);

  useEffect(() => {
    if (selectedState) {
      fetchCounties(selectedState);
    } else {
      setCounties([]);
    }
    setSelectedCounty("");
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      const res = await fetch("/api/states");
      const data = await res.json();
      setStates(data.states || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCounties = async (stateAbbr: string) => {
    setLoadingCounties(true);
    try {
      const res = await fetch(`/api/counties?state=${stateAbbr}&limit=1000`);
      const data = await res.json();
      setCounties(data.counties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCounties(false);
    }
  };

  const fetchData = async () => {
    withLoading(async () => {
      const params = new URLSearchParams();
      if (selectedState) params.append("state", selectedState);
      if (selectedCounty) params.append("countyId", selectedCounty);
      if (selectedCategory) params.append("categoryId", selectedCategory);

      const endpoint =
        activeTab === "seats" ? "/api/admin/seats" : "/api/admin/waitlist";
      const res = await fetch(`${endpoint}?${params.toString()}`);
      const data = await res.json();

      if (activeTab === "seats") {
        setSeats(data.seats || []);
      } else {
        setWaitlist(data.waitlist || []);
      }
    });
  };

  const [deleteConfig, setDeleteConfig] = useState<{
    id: number;
    type: "seat" | "waitlist";
  } | null>(null);

  const confirmDelete = async () => {
    if (!deleteConfig) return;

    withLoading(async () => {
      try {
        const endpoint =
          deleteConfig.type === "seat"
            ? `/api/admin/seats/${deleteConfig.id}`
            : `/api/admin/waitlist/${deleteConfig.id}`;

        const res = await fetch(endpoint, { method: "DELETE" });
        if (res.ok) {
          toast.success(
            `${deleteConfig.type === "seat" ? "Seat" : "Waitlist entry"} removed`,
          );
          fetchData();
        } else {
          toast.error("Deletion failed");
        }
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setDeleteConfig(null);
      }
    });
  };

  const handleRemoveSeat = (id: number) => {
    setDeleteConfig({ id, type: "seat" });
  };

  const handleRemoveWaitlist = (id: number) => {
    setDeleteConfig({ id, type: "waitlist" });
  };

  // Unified list of collapsed seats (Agent + Category)
  const flattenedSeats = seats.reduce(
    (acc, seat) => {
      // Key is Agent + Category
      const key = `${seat.agent_id}-${seat.category_id}`;

      const existing = acc.find((s) => (s as any).key === key);

      if (!existing) {
        acc.push({
          ...seat,
          key, // helper for deduplication
          products_count: 1,
          unique_counties: [seat.county_id],
        } as any);
      } else {
        (existing as any).products_count++;
        if (!(existing as any).unique_counties.includes(seat.county_id)) {
          (existing as any).unique_counties.push(seat.county_id);
        }
      }

      return acc;
    },
    [] as (Seat & { products_count: number; unique_counties: number[] })[],
  );

  const stateOptions = states.map((s) => ({
    label: `${s.name} (${s.code})`,
    value: s.code,
  }));
  const countyOptions = counties.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-6 w-1 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,184,0,0.4)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Inventory Management
            </span>
          </div>
          <h2 className="text-4xl font-black text-brand-navy tracking-tight italic">
            Seat <span className="text-brand-gold">Allocation</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg">
            Monitor active product assignments and manage the agent waitlist.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200/50">
          <button
            onClick={() => setActiveTab("seats")}
            className={`px-6 py-2.5 rounded-xl cursor-pointer text-sm font-black transition-all flex items-center gap-2 ${
              activeTab === "seats"
                ? "bg-white text-brand-navy shadow-lg shadow-slate-200 ring-1 ring-slate-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${activeTab === "seats" ? "text-brand-gold" : "opacity-0"}`}
            />
            Active Seats
          </button>
          <button
            onClick={() => setActiveTab("waitlist")}
            className={`px-6 py-2.5 rounded-xl text-sm cursor-pointer font-black transition-all flex items-center gap-2 ${
              activeTab === "waitlist"
                ? "bg-white text-brand-navy shadow-lg shadow-slate-200 ring-1 ring-slate-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Clock
              className={`w-4 h-4 ${activeTab === "waitlist" ? "text-brand-gold" : "opacity-0"}`}
            />
            Waitlist
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl   mb-0">
        <Filter className="w-4 h-4 text-brand-gold" />
        <span className="text-[10px] font-black text-brand-navy uppercase tracking-widest">
          Filters
        </span>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-wrap items-center gap-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative -mb-6">
            <SingleSelect
              label=""
              placeholder="All States"
              options={stateOptions}
              value={selectedState}
              onChange={setSelectedState}
            />
          </div>
          <div className="relative -mb-6">
            <SingleSelect
              label=""
              placeholder={loadingCounties ? "Loading..." : "All Counties"}
              options={countyOptions}
              value={selectedCounty}
              onChange={setSelectedCounty}
            />
          </div>
          <div className="relative -mb-6">
            <SingleSelect
              label=""
              placeholder="All Categories"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedState("");
            setSelectedCounty("");
            setSelectedCategory("");
          }}
          className="px-4 cursor-pointer py-2 text-[10px] font-black text-slate-400 hover:text-brand-navy uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-10">
          {isLoading ? (
            <Loader varient="table" />
          ) : activeTab === "seats" ? (
            /* SINGLE UNIFIED SEATS TABLE */
            <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm bg-slate-50/30 h-[calc(100vh-510px)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      AGENT
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      LOCATION
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      CATEGORY / COVERAGE
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      PLAN
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {flattenedSeats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100">
                            <AlertCircle className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            No assigned seats found matching filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    flattenedSeats.map((seat) => (
                      <tr
                        key={seat.id}
                        className="hover:bg-white transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-brand-navy font-black text-xs shadow-sm group-hover:bg-brand-gold/5 transition-colors">
                              {seat.Agent?.full_name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-black text-brand-navy leading-none mb-1">
                                {seat.Agent?.full_name || "Unknown Agent"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {seat.Agent?.email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <MapPin className="w-3 h-3 text-brand-gold fill-brand-gold/10" />
                            {seat.unique_counties?.length > 1
                              ? `Assigned in ${seat.unique_counties.length} Counties`
                              : `${seat.County?.name || "Unknown County"}, ${seat.County?.state_abbr || "??"}`}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-brand-navy uppercase tracking-tight italic">
                              {seat.Category?.name || "Unknown Category"}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              {seat.products_count} Products Assigned
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-2.5 py-1 bg-brand-gold/10 text-brand-gold text-[9px] font-black rounded-lg uppercase tracking-wider border border-brand-gold/5">
                            {seat.Agent?.plan_type === "agent_pro"
                              ? "PRO"
                              : seat.Agent?.plan_type || "N/A"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleRemoveSeat(seat.id)}
                            className="p-2.5 rounded-xl hover:bg-white text-slate-300 hover:text-red-500 border border-transparent hover:border-red-100 hover:shadow-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* WAITLIST VIEW (Flat List) */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      AGENT
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      LOCATION
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      PRODUCT / CATEGORY
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      WAITING SINCE
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {waitlist.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-20 text-center text-slate-400 font-medium text-sm italic"
                      >
                        The waitlist is currently empty for the selected
                        filters.
                      </td>
                    </tr>
                  ) : (
                    waitlist.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-brand-navy font-black text-xs">
                              {entry.Agent?.full_name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-sm font-black text-brand-navy leading-none mb-1">
                                {entry.Agent?.full_name || "Unknown Agent"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {entry.Agent?.email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 italic">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            {entry.County?.name || "Unknown"},{" "}
                            {entry.County?.state_abbr || "??"}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-xs font-black text-brand-navy">
                              {entry.Product?.name || "Unknown Product"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              {entry.Category?.name || "Unknown Category"}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                            {entry.created_at
                              ? new Date(entry.created_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleRemoveWaitlist(entry.id)}
                            className="p-2.5 rounded-xl hover:bg-white text-slate-300 hover:text-red-500 border border-transparent hover:border-red-100 hover:shadow-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfig && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDeleteConfig(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto border border-red-100 animate-bounce">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-brand-navy tracking-tight italic">
                  Confirm{" "}
                  <span className="text-red-500">
                    {deleteConfig.type === "seat"
                      ? "Inactivation"
                      : "Cancellation"}
                  </span>
                </h3>
                <p className="text-slate-500 font-medium">
                  Are you sure you want to{" "}
                  {deleteConfig.type === "seat" ? "deactivate" : "cancel"} this{" "}
                  {deleteConfig.type}?
                  {deleteConfig.type === "seat" &&
                    " This will set all product assignments in this category to inactive for this agent and county."}
                  This action will archive the record and release the seat.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-red-500/20 transition-all active:scale-95"
                >
                  Yes,{" "}
                  {deleteConfig.type === "seat"
                    ? "Deactivate Assignment"
                    : "Cancel Waitlist"}
                </button>
                <button
                  onClick={() => setDeleteConfig(null)}
                  className="w-full py-4 bg-slate-100 cursor-pointer hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95"
                >
                  Cancel and Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
