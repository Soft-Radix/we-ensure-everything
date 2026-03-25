"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CoverageStep from "@/components/agent/CoverageStep";
import { Step } from "@/lib/data/categories";
import UserDetailsStep from "@/components/agent/UserDetailsStep";
import AgentResultStep from "@/components/agent/AgentResultStep";
import {
  Agent,
  Category,
  County,
  Product,
  RoutingStatus,
} from "@/lib/data/agentTypes";
import * as Yup from "yup";
import { useFormik } from "formik";
import StepIndicator from "@/components/agent/StepIndicator";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string(),
});

/* ── Main Page ──────── */
function FindAgentContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category") || "";
  const [step, setStep] = useState<Step>(initCategory ? 2 : 1);
  const [counties, setCounties] = useState<County[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [countySearch, setCountySearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [routingResult, setRoutingResult] = useState<{
    status: RoutingStatus;
    agent?: Agent;
    leadId?: string;
    message?: string;
  } | null>(null);

  /* Load categories once */
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        if (initCategory) {
          const found = (d.categories || []).find(
            (c: Category) => c.code === initCategory,
          );
          if (found) setSelectedCategory(found);
        }
      });

    fetch("/api/states")
      .then((r) => r.json())
      .then((d) => setStates(d.states || []));
  }, [initCategory]);

  /* Search counties */
  useEffect(() => {
    if (countySearch.length < 2) {
      setCounties([]);
      return;
    }
    const timer = setTimeout(() => {
      const stateParam =
        selectedState && selectedState.code !== "ALL"
          ? `&state=${selectedState.code}`
          : "";
      fetch(
        `/api/counties?q=${encodeURIComponent(countySearch)}&limit=20${stateParam}`,
      )
        .then((r) => r.json())
        .then((d) => setCounties(d.counties || []));
    }, 280);
    return () => clearTimeout(timer);
  }, [countySearch, selectedState]);

  /* Load products when category selected */
  useEffect(() => {
    if (!selectedCategory) return;
    fetch(`/api/categories/${selectedCategory.code}/products`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, [selectedCategory]);
  const [submitted, setSubmitted] = useState(false);
  const extraErrors = {
    county: submitted && !selectedCounty ? "Please select your county" : "",
    product: submitted && !selectedProduct ? "Please select a product" : "",
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitted(true);
      if (!selectedCounty || !selectedCategory || !selectedProduct) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            countyId: selectedCounty.id,
            categoryCode: selectedCategory.code,
            productCode: selectedProduct.code,
            ...values,
            source: "website",
          }),
        });

        const data = await res.json();
        setRoutingResult(data);
        setStep(3);
      } catch {
        setRoutingResult({
          status: null,
          message: "Something went wrong. Please try again.",
        });
        setStep(3);
      } finally {
        setLoading(false);
      }
    },
  });
  const handleReset = () => {
    formik.resetForm();
    setSelectedCounty(null);
    setSelectedCategory(null);
    setSelectedProduct(null);
    setCountySearch("");
    setSelectedState(null);
    setRoutingResult(null);
    setSubmitted(false);
    setStep(1);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-brand-navy text-white py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/10 pointer-events-none skew-x-12 transform translate-x-20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block text-brand-gold font-bold text-sm uppercase tracking-[0.2em] mb-4">
            Secure Matching System
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-black mb-6">
            Get Matched with a Licensed Agent
          </h1>
          <p className="text-white/60 text-lg md:text-lg max-w-2xl mx-auto font-light">
            Tell us what you need and we&apos;ll instantly connect you with a
            vetted professional in your area.
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="bg-white border-b border-slate-200 py-4 sticky top-16 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <StepIndicator current={step} />
        </div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* ── STEP 1: Coverage ───────────────────────────────── */}
          {step === 1 && (
            <CoverageStep
              setSelectedCategory={setSelectedCategory}
              setStep={setStep}
              categories={categories}
            />
          )}

          {/* ── STEP 2: Location & Details ─────────────────────── */}
          {step === 2 && (
            <UserDetailsStep
              setStep={setStep}
              selectedCategory={selectedCategory}
              selectedProduct={selectedProduct}
              loading={loading}
              countySearch={countySearch}
              setCountySearch={setCountySearch}
              selectedCounty={selectedCounty}
              setSelectedCounty={setSelectedCounty}
              counties={counties}
              products={products}
              setCounties={setCounties}
              setSelectedProduct={setSelectedProduct}
              formik={formik}
              extraErrors={extraErrors}
              states={states}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />
          )}

          {/* ── STEP 3: Match Result ───────────────────────────── */}
          {step === 3 && routingResult && (
            <AgentResultStep
              routingResult={routingResult}
              handleReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function FindAgentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="spinner" />
        </div>
      }
    >
      <FindAgentContent />
    </Suspense>
  );
}
