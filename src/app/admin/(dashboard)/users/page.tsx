"use client";
import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import Loader from "@/components/admin/Loader";
import Pagination from "@/components/admin/Pagination";
import { SortDirection } from "@/lib/enum";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  routing_status: "assigned" | "no_agent" | "waitlisted" | "error";
  created_at: string;
  County?: { name: string; state_abbr: string };
  Category?: { name: string };
  Product?: { name: string };
  Agent?: { full_name: string };
}

export default function UsersPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { isLoading: loading, withLoading } = useLoading();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState<SortDirection>(SortDirection.ASC);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    withLoading(async () => {
      const res = await fetch(
        `/api/admin/leads?page=${page}&limit=10&${debouncedSearch ? `search=${debouncedSearch}` : ""}&direction=${direction}`,
      );
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setTotal(data.total);
      }
    });
  }, [page, debouncedSearch, direction]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "assigned":
        return {
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          icon: CheckCircle2,
        };
      case "no_agent":
        return {
          color: "text-rose-600 bg-rose-50 border-rose-100",
          icon: XCircle,
        };
      case "waitlisted":
        return {
          color: "text-amber-600 bg-amber-50 border-amber-100",
          icon: Clock,
        };
      default:
        return {
          color: "text-slate-400 bg-slate-50 border-slate-100",
          icon: Clock,
        };
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-6 w-1 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,184,0,0.4)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Consumer Inquiries
            </span>
          </div>
          <h2 className="text-4xl font-black text-brand-navy tracking-tight italic">
            User{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-gold to-yellow-500">
              Leads
            </span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg">
            Active marketplace users searching for exclusive insurance coverage.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name..."
              className="w-64 pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 transition-all font-medium text-slate-600"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-gold" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden animate-in slide-in-from-bottom duration-1000">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <div
                    onClick={() =>
                      setDirection(
                        direction === SortDirection.DESC
                          ? SortDirection.ASC
                          : SortDirection.DESC,
                      )
                    }
                    className="flex items-center gap-1.5 hover:text-brand-navy transition-colors cursor-pointer"
                  >
                    USER PROFILE <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  REQUEST TYPE
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  LOCATION
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  ROUTING STATUS
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                  TIMESTAMP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td
                      colSpan={5}
                      className="px-10 py-8 bg-slate-50/10 h-24"
                    />
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-10 py-20 text-center text-slate-400 font-medium"
                  >
                    No active leads {search ? `named "${search}"` : ""} found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const status = getStatusStyle(lead.routing_status);
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-100/30 transition-colors group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand-navy font-black text-xs border border-slate-200 group-hover:bg-brand-gold group-hover:text-white transition-all shadow-inner uppercase tracking-wider group-hover:shadow-brand-gold/10">
                            {lead.first_name?.charAt(0)}
                            {lead.last_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-brand-navy text-sm tracking-tight leading-none group-hover:text-brand-gold transition-colors">
                              {lead.first_name} {lead.last_name}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none flex items-center gap-1">
                                <Mail className="w-2.5 h-2.5" />
                                {lead.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-slate-700 tracking-tight">
                            {lead.Category?.name || "N/A"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            {lead.Product?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold opacity-60" />
                          <span className="text-xs font-bold text-slate-600">
                            {lead.County?.name || "Unknown"},{" "}
                            {lead.County?.state_abbr || "--"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${status.color} shadow-sm`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {lead.routing_status.replace("_", " ")}
                        </div>
                        {lead.Agent && (
                          <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-2 border-l border-slate-200 ml-4 italic">
                            Assigned To:{" "}
                            <span className="text-brand-navy">
                              {lead.Agent.full_name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Calendar className="w-3 h-3 text-slate-300" />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            {new Date(lead.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic decoration-brand-gold/30 underline underline-offset-4">
            Real-time Ingestion •{" "}
            <span className="text-brand-navy">{total}</span> total leads
          </div>

          <Pagination page={page} total={total} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}
