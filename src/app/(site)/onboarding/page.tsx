"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  ChevronRight,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Map as MapIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { PlanType } from "@/lib/enum";
import MultiSelect from "@/components/agent/Multiselect";
import { onboardingSchema } from "@/lib/schema/agentSchema";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<any>(null);

  const [statesList, setStatesList] = useState<any[]>([]);
  const [countiesList, setCountiesList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    message: string;
  } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      selectedStates: [] as string[],
      selectedCounties: [] as string[],
      selectedCategories: [] as string[],
      selectedProducts: [] as string[],
      planType: "" as PlanType | "",
    },
    validationSchema: onboardingSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Territory claim processed successfully!");
          window.location.href = "/agent-portal";
        } else {
          toast.error(data.error || "Failed to complete onboarding");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch initial data
  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => setStatesList(data.states || []));
    // Fetch categories with products included
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        // We need the products, but the /api/categories might not return them in the main list
        // Let's check if it does. If not, we fetch them individually or use a different endpoint.
        // Actually, the previous view_file showed it includes Products as association but maps them out.
        // I'll fetch them individually if needed, but let's try to get all products.
        setCategoriesList(data.categories || []);
      });
  }, []);

  // Fetch counties when selections change
  useEffect(() => {
    if (formik.values.selectedStates.length === 0) {
      setCountiesList([]);
      return;
    }
    const stateCodes = formik.values.selectedStates.join(",");
    fetch(`/api/counties?states=${stateCodes}&limit=1000`)
      .then((res) => res.json())
      .then((data) => setCountiesList(data.counties || []));
  }, [formik.values.selectedStates]);

  // Derive products list from selected categories
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  useEffect(() => {
    if (formik.values.selectedCategories.length === 0) {
      setAvailableProducts([]);
      return;
    }

    const fetchProducts = async () => {
      // Find codes for selected IDs to use with the existing products API
      const selectedCats = categoriesList.filter((c) =>
        formik.values.selectedCategories.includes(c.id.toString()),
      );
      const promises = selectedCats.map((c) =>
        fetch(`/api/categories/${c.code}/products`).then((r) => r.json()),
      );
      const results = await Promise.all(promises);
      const allProds = results.flatMap((r) => r.products || []);
      // Unique by ID
      const unique = Array.from(
        new Map(allProds.map((p) => [p.id, p])).values(),
      );
      setAvailableProducts(unique);
    };

    fetchProducts();
  }, [formik.values.selectedCategories, categoriesList]);

  // Check availability
  useEffect(() => {
    const check = async () => {
      if (!agent) return;

      const {
        selectedStates,
        selectedCounties,
        selectedCategories,
        selectedProducts,
        planType,
      } = formik.values;
      let ready = false;

      if (
        planType === PlanType.REFFERAL_PRO &&
        selectedCounties.length > 0 &&
        selectedCategories.length > 0 &&
        selectedProducts.length > 0
      )
        ready = true;
      else if (
        planType === PlanType.AGENT_PRO &&
        selectedCounties.length > 0 &&
        selectedCategories.length > 0
      )
        ready = true;
      else if (
        planType === PlanType.AGENT_PRO_PLUS &&
        selectedStates.length > 0 &&
        selectedCategories.length > 0
      )
        ready = true;

      if (!ready) {
        setAvailability(null);
        return;
      }

      setCheckingAvailability(true);
      try {
        const res = await fetch("/api/onboarding/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formik.values),
        });
        const data = await res.json();
        setAvailability({
          isAvailable: data.isAvailable,
          message: data.message,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingAvailability(false);
      }
    };
    check();
  }, [formik.values, agent]);

  const handleVerifyEmail = async () => {
    if (!formik.values.email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/check-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formik.values.email }),
      });
      const data = await res.json();
      if (data.success) {
        setAgent(data.agent);
        formik.setFieldValue("planType", data.agent.planType);
        setStep(2);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-3xl mb-6 shadow-inner">
            <LayoutGrid className="text-brand-gold" size={32} />
          </div>
          <h1 className="text-4xl font-heading font-black text-brand-navy mb-3">
            Territory Onboarding
          </h1>
          <p className="text-slate-500 text-lg max-w-sm mx-auto">
            Secure your exclusive specialist markets and start accepting leads.
          </p>
        </div>

        <div className="bg-white rounded-4xl shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

          {step === 1 ? (
            <div className="space-y-8 relative z-10">
              <div className="bg-brand-navy/5 p-6 rounded-3xl border border-brand-navy/10">
                <p className="text-brand-navy font-bold text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-gold" />
                  Account Verification
                </p>
                <p className="text-xs text-slate-500">
                  Enter the email address you used during payment to unlock your
                  territory selection.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-3 text-sm ml-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all text-lg"
                    placeholder="agent@example.com"
                    value={formik.values.email}
                    onChange={(e) =>
                      formik.setFieldValue("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleVerifyEmail}
                disabled={loading}
                className="w-full py-5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl font-black text-lg transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
              >
                {loading ? "Verifying Account..." : "Verify & Continue"}
              </button>
            </div>
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-6 relative z-10"
            >
              {/* Agent Badge */}
              <div className="flex items-center justify-between bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <CheckCircle2 className="text-brand-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy">
                      {agent.fullName}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest font-black text-brand-gold">
                      {agent.planType.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-brand-navy underline"
                >
                  Change Email
                </button>
              </div>

              {/* Selections */}
              <div className="grid grid-cols-1 gap-2">
                <MultiSelect
                  label="Which states are you licensed in? *"
                  options={statesList.map((s) => ({
                    label: s.name,
                    value: s.code,
                  }))}
                  selected={formik.values.selectedStates}
                  onChange={(vals) => {
                    formik.setFieldValue("selectedStates", vals);
                    formik.setFieldValue("selectedCounties", []);
                  }}
                  error={formik.errors.selectedStates as string}
                />

                {agent.planType !== PlanType.AGENT_PRO_PLUS && (
                  <MultiSelect
                    label="Select Your Counties *"
                    showSelectAll
                    options={countiesList.map((c) => ({
                      label: `${c.name}, ${c.state_abbr}`,
                      value: c.id.toString(),
                    }))}
                    selected={formik.values.selectedCounties}
                    onChange={(vals) =>
                      formik.setFieldValue("selectedCounties", vals)
                    }
                    error={formik.errors.selectedCounties as string}
                    placeholder={
                      formik.values.selectedStates.length > 0
                        ? "Select counties..."
                        : "First select states"
                    }
                  />
                )}

                <MultiSelect
                  label="Type of Coverage *"
                  options={categoriesList.map((c) => ({
                    label: c.name,
                    value: c.id.toString(),
                  }))}
                  selected={formik.values.selectedCategories}
                  onChange={(vals) => {
                    formik.setFieldValue("selectedCategories", vals);
                    formik.setFieldValue("selectedProducts", []);
                  }}
                  error={formik.errors.selectedCategories as string}
                />

                {agent.planType === PlanType.REFFERAL_PRO && (
                  <MultiSelect
                    label="Specific Products *"
                    showSelectAll
                    options={availableProducts.map((p) => ({
                      label: p.name,
                      value: p.id.toString(),
                    }))}
                    selected={formik.values.selectedProducts}
                    onChange={(vals) =>
                      formik.setFieldValue("selectedProducts", vals)
                    }
                    error={formik.errors.selectedProducts as string}
                    placeholder={
                      formik.values.selectedCategories.length > 0
                        ? "Select products..."
                        : "First select coverage"
                    }
                  />
                )}
              </div>

              {/* Status Display */}
              {checkingAvailability ? (
                <div className="flex items-center gap-3 text-slate-400 py-2 ml-1">
                  <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">
                    Checking market availability...
                  </span>
                </div>
              ) : (
                availability && (
                  <div
                    className={`p-6 rounded-3xl flex items-start gap-4 transition-all animate-in fade-in slide-in-from-top-2 ${availability.isAvailable ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${availability.isAvailable ? "bg-white" : "bg-white"}`}
                    >
                      {availability.isAvailable ? (
                        <MapIcon size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">
                        {availability.isAvailable
                          ? "Market Open"
                          : "High Demand Area"}
                      </p>
                      <p className="text-xs leading-relaxed mt-0.5 opacity-90">
                        {availability.message}
                      </p>
                    </div>
                  </div>
                )
              )}

              <button
                type="submit"
                disabled={loading || checkingAvailability}
                className="w-full py-5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl font-black text-lg transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {availability?.isAvailable
                      ? "Claim Exclusive Markets"
                      : "Secure Waitlist Spot"}
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
