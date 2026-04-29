"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  UserPlus,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import Pagination from "@/components/admin/Pagination";
import { SortDirection } from "@/lib/enum";
import Loader from "@/components/admin/Loader";
import AssignSeatModal from "@/components/admin/AssignSeatModal";
import { CheckCircle } from "lucide-react";

interface Agent {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  photo_url?: string;
  seat_count: number;
  created_at: string;
  plan_type: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const { isLoading: loading, withLoading } = useLoading();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState<SortDirection>(SortDirection.ASC);
  const debouncedSearch = useDebounce(search, 500);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAgents = async () => {
    withLoading(async () => {
      const res = await fetch(
        `/api/agents?page=${page}&limit=10${debouncedSearch ? `&search=${debouncedSearch}` : ""}${direction ? `&direction=${direction}` : ""}`,
      );
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents);
        setTotal(data.total);
      }
    });
  };

  useEffect(() => {
    fetchAgents();
  }, [page, debouncedSearch, direction]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-6 w-1 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(255,184,0,0.4)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Marketplace Network
            </span>
          </div>
          <h2 className="text-4xl font-black text-brand-navy tracking-tight italic">
            Verified{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-gold to-yellow-500">
              Agents
            </span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg">
            Manage national insurance experts and their exclusive county seats.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group overflow-hidden">
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 transition-all font-medium text-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
          </div>
          <button className="bg-brand-navy hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-sm tracking-wide gap-2 flex items-center transition-all shadow-lg hover:shadow-brand-navy/10 transform hover:-translate-y-0.5 active:scale-95 group">
            <UserPlus className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" />
            Add Agent
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden animate-in slide-in-from-bottom duration-1000">
        <div className="overflow-x-auto h-[calc(100vh-360px)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100/50 sticky top-0 z-10">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-navy transition-colors">
                    AGENT PROFILE{" "}
                    <ArrowUpDown
                      onClick={() =>
                        setDirection(
                          direction === SortDirection.DESC
                            ? SortDirection.ASC
                            : SortDirection.DESC,
                        )
                      }
                      className="w-3 h-3 opacity-50"
                    />
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  CONTACT INFO
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                  TOTAL SEATS
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  STATUS
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  PLAN TYPE
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <Loader varient="table" />
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-10 py-20 text-center text-slate-400 font-medium"
                  >
                    No agents named "{search}" found in record.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-slate-100/30 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-inner ring-4 ring-transparent group-hover:ring-brand-gold/10 transition-all border border-slate-100">
                          {agent.photo_url ? (
                            <Image
                              src={agent.photo_url}
                              alt={agent.full_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-brand-navy font-black text-lg">
                              {agent.full_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-brand-navy text-sm tracking-tight leading-none group-hover:text-brand-gold transition-colors">
                            {agent.full_name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
                            ID: #PRO-00{agent.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Mail className="w-3 h-3 text-slate-300" />
                          {agent.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 italic">
                          <Phone className="w-3 h-3" />
                          {agent.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 w-[100px] block py-1.5 bg-brand-gold/5 text-brand-gold border border-brand-gold/10 rounded-full text-xs font-black shadow-[0_2px_8px_rgba(255,184,0,0.05)]">
                        {agent.seat_count} ACTIVE
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-slate-300"}`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${agent.status === "active" ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {agent.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 w-[100px] text-center block py-1.5 bg-brand-gold/5 text-brand-gold border border-brand-gold/10 rounded-full text-xs font-black shadow-[0_2px_8px_rgba(255,184,0,0.05)]">
                        {agent.plan_type ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedAgent(agent);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest border border-brand-gold/20"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Assign
                        </button>
                        {/* <button className="p-2.5 rounded-xl hover:bg-white hover:text-brand-navy hover:shadow-lg transition-all group-active:scale-95 border border-transparent hover:border-slate-100 text-slate-300">
                          <MoreHorizontal className="w-5 h-5" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-brand-navy">{agents.length}</span> of{" "}
            <span className="text-brand-navy">{total}</span> Verified Agents
          </div>

          <Pagination page={page} total={total} setPage={setPage} />
        </div>
      </div>

      {selectedAgent && (
        <AssignSeatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          agent={selectedAgent}
          onSuccess={fetchAgents}
        />
      )}
    </div>
  );
}
