import { RoutingStatus, Agent } from "@/lib/data/agentTypes";

interface AgentResultStepProps {
  routingResult: {
    status: RoutingStatus;
    agent?: Agent;
    leadId?: string;
    message?: string;
  };
  handleReset: () => void;
}

const AgentResultStep = ({
  routingResult,
  handleReset,
}: AgentResultStepProps) => {
  return (
    <div className="p-10 md:p-10 animate-fade-in text-center">
      {routingResult.status === "assigned" && routingResult.agent && (
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-brand-accent-green rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-2xl">
            ✓
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy mb-4">
            We&apos;ve Found Your Match!
          </h2>
          <p className="text-slate-500 text-lg mb-12">
            Based on your location and needs, we&apos;ve connected you with a
            licensed specialist.
          </p>

          <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col items-center">
            <div className="w-32 h-32 bg-brand-navy rounded-full flex items-center justify-center text-white text-4xl font-black mb-6 shadow-xl border-4 border-white">
              {routingResult.agent.fullName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <h3 className="text-3xl font-heading font-black text-brand-navy mb-2">
              {routingResult.agent.fullName}
            </h3>
            <div className="px-4 py-1 bg-brand-gold/20 text-brand-gold-dark rounded-full text-xs font-black uppercase tracking-widest mb-6">
              Exclusive Licensed Agent
            </div>

            <div className="space-y-4 w-full max-w-sm">
              <a
                href={`tel:${routingResult.agent.phone}`}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white border border-slate-200 rounded-xl font-bold text-brand-navy hover:border-brand-gold transition-colors no-underline"
              >
                📞 {routingResult.agent.phone}
              </a>
              <a
                href={`mailto:${routingResult.agent.email}`}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white border border-slate-200 rounded-xl font-bold text-brand-navy hover:border-brand-gold transition-colors no-underline"
              >
                ✉️ {routingResult.agent.email}
              </a>
            </div>

            <p className="text-slate-400 text-xs mt-8 italic">
              {routingResult.message}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="mt-12 cursor-pointer text-brand-gold font-black uppercase tracking-widest hover:underline"
          >
            Start New Search
          </button>
        </div>
      )}

      {routingResult.status === "no_agent" && (
        <div className="max-w-xl mx-auto">
          <div className="text-6xl mb-8">🗺️</div>
          <h2 className="text-3xl font-heading font-black text-brand-navy mb-6">
            Searching Beyond Local...
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            We don&apos;t have an exclusive agent in that specific county yet,
            but our regional specialists are being notified.{" "}
            {routingResult.message}
          </p>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">
              Reference ID
            </span>
            <code className="text-brand-navy font-bold">
              {routingResult.leadId}
            </code>
          </div>
          <button
            onClick={handleReset}
            className="mt-8 cursor-pointer text-brand-gold font-black uppercase tracking-widest hover:underline"
          >
            Start New Search
          </button>
        </div>
      )}

      {/* Error cases */}
      {(routingResult.status === "duplicate" || !routingResult.status) && (
        <div className="max-w-xl mx-auto py-10">
          <div className="text-6xl mb-8">⚠️</div>
          <h2 className="text-2xl font-heading font-black text-brand-navy mb-6">
            {routingResult.status === "duplicate"
              ? "Lead Already Registered"
              : "Something Went Wrong"}
          </h2>
          <p className="text-slate-500 mb-10">
            {routingResult.message ||
              "We encountered an error processing your request. Please try again or contact support."}
          </p>
          <button
            onClick={handleReset}
            className="bg-brand-navy cursor-pointer text-white px-10 py-4 rounded-full font-bold"
          >
            Return to Start
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentResultStep;
