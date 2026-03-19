"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ── Types ───────────────────────────────────────────────────── */
interface County {
  id: number;
  fips_code: string;
  name: string;
  state: string;
  state_abbr: string;
}
interface Category {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}
interface Product {
  code: string;
  name: string;
}
interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  bio?: string;
  websiteUrl?: string;
  licenseState?: string;
}
type Step = 1 | 2 | 3 | 4;
type RoutingStatus = "assigned" | "no_agent" | "duplicate" | null;

/* ── Step Indicator Component ────────────────────────────────── */
function StepIndicator({ current }: { current: Step }) {
  const steps = ["County", "Category", "Product", "Result"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const stepNum = (i + 1) as Step;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${isDone ? "bg-[#3FCF40] text-white shadow-md" : ""}
                ${isActive ? "bg-[#1378B2] text-white shadow-lg ring-4 ring-[#1378B2]/20" : ""}
                ${!isDone && !isActive ? "bg-slate-200 text-slate-500" : ""}`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${isActive ? "text-[#1378B2]" : isDone ? "text-[#3FCF40]" : "text-slate-400"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-10 md:w-16 h-0.5 mb-4 rounded transition-all duration-300 ${isDone ? "bg-[#3FCF40]" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Page (wrapped in Suspense for useSearchParams) ──────── */
function FindAgentContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category") || "";

  const [step, setStep] = useState<Step>(initCategory ? 2 : 1);
  const [counties, setCounties] = useState<County[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [countySearch, setCountySearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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
  }, [initCategory]);

  /* Search counties */
  useEffect(() => {
    if (countySearch.length < 2) {
      setCounties([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/counties?q=${encodeURIComponent(countySearch)}&limit=20`)
        .then((r) => r.json())
        .then((d) => setCounties(d.counties || []));
    }, 280);
    return () => clearTimeout(timer);
  }, [countySearch]);

  /* Load products when category selected */
  useEffect(() => {
    if (!selectedCategory) return;
    fetch(`/api/categories/${selectedCategory.code}/products`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, [selectedCategory]);

  /* Validation */
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email address";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit routing request */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    if (!selectedCounty || !selectedCategory || !selectedProduct) return;

    setLoading(true);
    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countyId: selectedCounty.id,
          categoryCode: selectedCategory.code,
          productCode: selectedProduct.code,
          ...form,
          source: "website",
        }),
      });
      const data = await res.json();
      setRoutingResult(data);
      setStep(4);
    } catch {
      setRoutingResult({
        status: null,
        message: "Something went wrong. Please try again.",
      });
      setStep(4);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCounty, selectedCategory, selectedProduct, form]);

  const canProceedStep1 = !!selectedCounty;
  const canProceedStep2 = !!selectedCategory;
  const canProceedStep3 = !!selectedProduct;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Page header */}
      <div className="bg-linear-to-br from-[#0D5A8A] to-[#1378B2] text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Find Your Exclusive Agent
          </h1>
          <p className="text-white/80 text-lg">
            Select your county, coverage type, and product — we&apos;ll match
            you instantly.
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="bg-white border-b border-slate-200 py-5 sticky top-16 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 flex justify-center overflow-x-auto">
          <StepIndicator current={step} />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* ── STEP 1: County ─────────────────────────────────── */}
          {step === 1 && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl bg-[#E8F4FD] flex items-center justify-center text-[#1378B2] font-black"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  1
                </div>
                <div>
                  <h2
                    className="font-black text-xl text-slate-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Select Your County
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Search from all 3,143 U.S. counties
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="county-search"
                  value={countySearch}
                  onChange={(e) => setCountySearch(e.target.value)}
                  placeholder="Type county name… (e.g. Miami-Dade, Los Angeles)"
                  className="w-full px-5 py-4 border-2 border-slate-200 focus:border-[#1378B2] focus:ring-4 focus:ring-[#1378B2]/10 rounded-xl text-base outline-none transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </div>
              </div>

              {/* Selected badge */}
              {selectedCounty && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-[#E8F4FD] rounded-xl border border-[#1378B2]/20">
                  <span className="text-[#3FCF40] text-xl">✓</span>
                  <div>
                    <span className="font-bold text-[#1378B2]">
                      {selectedCounty.name}, {selectedCounty.state_abbr}
                    </span>
                    <span className="text-slate-500 text-sm ml-2">
                      selected
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCounty(null);
                      setCountySearch("");
                    }}
                    className="ml-auto text-slate-400 hover:text-slate-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Dropdown */}
              {counties.length > 0 && !selectedCounty && (
                <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                  {counties.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCounty(c);
                        setCounties([]);
                        setCountySearch("");
                      }}
                      className="w-full text-left px-5 py-3.5 hover:bg-[#E8F4FD] flex justify-between items-center transition-colors border-b border-slate-100 last:border-0"
                    >
                      <span className="font-medium text-slate-800">
                        {c.name} County
                      </span>
                      <span className="text-sm text-slate-400 font-medium">
                        {c.state_abbr}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {countySearch.length >= 2 &&
                counties.length === 0 &&
                !selectedCounty && (
                  <div className="mt-4 text-center py-8 text-slate-400">
                    <div className="text-3xl mb-2">🗺️</div>
                    <p>No counties found for &quot;{countySearch}&quot;</p>
                    <p className="text-sm mt-1">
                      Try a different name or check spelling
                    </p>
                  </div>
                )}

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="bg-[#1378B2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:bg-[#0D5A8A] shadow-md"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Next: Choose Coverage →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Category ───────────────────────────────── */}
          {step === 2 && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl bg-[#E8F4FD] flex items-center justify-center text-[#1378B2] font-black"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  2
                </div>
                <div>
                  <h2
                    className="font-black text-xl text-slate-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Choose Insurance Category
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Select the type of coverage you need
                  </p>
                </div>
              </div>

              {categories.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="spinner" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.code}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex flex-col gap-3 p-6 text-left border-2 rounded-2xl cursor-pointer transition-all duration-200
                        ${
                          selectedCategory?.code === cat.code
                            ? "border-[#1378B2] bg-[#E8F4FD] shadow-md"
                            : "border-slate-200 bg-white hover:border-[#1378B2] hover:shadow-md hover:-translate-y-0.5"
                        }`}
                    >
                      <div className="text-3xl">{cat.icon}</div>
                      <div>
                        <div
                          className="font-bold text-sm text-slate-900 mb-1"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {cat.name}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed">
                          {cat.description}
                        </div>
                      </div>
                      <div className="text-[10px] text-[#1378B2] font-bold uppercase tracking-wide">
                        {cat.productCount} products
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="bg-[#1378B2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:bg-[#0D5A8A] shadow-md"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Next: Choose Product →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Product + Contact Form ─────────────────── */}
          {step === 3 && (
            <div className="p-8 md:p-10 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl bg-[#E8F4FD] flex items-center justify-center text-[#1378B2] font-black"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  3
                </div>
                <div>
                  <h2
                    className="font-black text-xl text-slate-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Select Your Product
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Choose the specific coverage {selectedCategory?.name}
                  </p>
                </div>
              </div>

              {/* Product list */}
              {products.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="spinner" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {products.map((p) => (
                    <button
                      key={p.code}
                      onClick={() => setSelectedProduct(p)}
                      className={`flex items-center gap-4 px-5 py-4 text-left border-2 rounded-xl cursor-pointer transition-all
                        ${
                          selectedProduct?.code === p.code
                            ? "border-[#1378B2] bg-[#E8F4FD]"
                            : "border-slate-200 bg-white hover:border-[#1378B2] hover:bg-slate-50"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                        ${selectedProduct?.code === p.code ? "border-[#1378B2] bg-[#1378B2]" : "border-slate-300"}`}
                      >
                        {selectedProduct?.code === p.code && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium text-sm text-slate-800">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Agent Preview & Contact form */}
              {selectedProduct && (
                <div className="border-t border-slate-200 pt-8 animate-fade-in">
                  <h3
                    className="font-bold text-lg text-slate-900 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Your Contact Information
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    So your agent can reach you. We respect your privacy.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      {
                        id: "firstName",
                        label: "First Name",
                        placeholder: "John",
                        type: "text",
                      },
                      {
                        id: "lastName",
                        label: "Last Name",
                        placeholder: "Smith",
                        type: "text",
                      },
                      {
                        id: "email",
                        label: "Email Address",
                        placeholder: "john@example.com",
                        type: "email",
                      },
                      {
                        id: "phone",
                        label: "Phone Number",
                        placeholder: "(555) 123-4567",
                        type: "tel",
                      },
                    ].map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
                        >
                          {field.label}
                          {field.id !== "phone" && (
                            <span className="text-red-400 ml-1">*</span>
                          )}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={form[field.id as keyof typeof form]}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm outline-none transition-all
                            ${
                              formErrors[field.id]
                                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                : "border-slate-200 focus:border-[#1378B2] focus:ring-4 focus:ring-[#1378B2]/10"
                            }`}
                        />
                        {formErrors[field.id] && (
                          <p className="mt-1.5 text-red-500 text-xs">
                            {formErrors[field.id]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep3 || loading}
                  className="bg-[#3FCF40] hover:bg-[#2DA82E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-md flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {loading ? (
                    <>
                      <div className="spinner !w-5 !h-5 !border-white/30 !border-t-white" />{" "}
                      Searching…
                    </>
                  ) : (
                    "🔍 Find My Agent"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Result ─────────────────────────────────── */}
          {step === 4 && routingResult && (
            <div className="p-8 md:p-10 animate-fade-in">
              {/* Summary bar */}
              <div className="flex flex-wrap gap-3 mb-8 text-sm">
                {[
                  {
                    label: "📍 County",
                    value:
                      selectedCounty?.name + ", " + selectedCounty?.state_abbr,
                  },
                  { label: "📁 Category", value: selectedCategory?.name },
                  { label: "📄 Product", value: selectedProduct?.name },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full"
                  >
                    <span className="text-slate-500 text-xs">{b.label}</span>
                    <span className="font-semibold text-slate-700 text-xs">
                      {b.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* ASSIGNED */}
              {routingResult.status === "assigned" && routingResult.agent && (
                <div className="border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-green-50 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-[#3FCF40] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-5 shadow-lg">
                    ✓
                  </div>
                  <h2
                    className="font-black text-2xl text-slate-900 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Your Agent Has Been Found!
                  </h2>
                  <p className="text-slate-500 mb-8">{routingResult.message}</p>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 max-w-sm mx-auto">
                    <div
                      className="w-20 h-20 bg-linear-to-br from-[#1378B2] to-[#0D5A8A] rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-md"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {routingResult.agent.firstName[0]}
                      {routingResult.agent.lastName[0]}
                    </div>
                    <h3
                      className="font-black text-xl text-slate-900 mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {routingResult.agent.firstName}{" "}
                      {routingResult.agent.lastName}
                    </h3>
                    <p className="text-[#1378B2] font-semibold text-sm mb-4">
                      Exclusive Agent · {selectedCounty?.state_abbr}
                      {routingResult.agent.licenseState &&
                        ` · Licensed in ${routingResult.agent.licenseState}`}
                    </p>
                    {routingResult.agent.bio && (
                      <p className="text-slate-500 text-sm leading-relaxed mb-5">
                        {routingResult.agent.bio}
                      </p>
                    )}
                    <div className="space-y-2.5">
                      {routingResult.agent.email && (
                        <a
                          href={`mailto:${routingResult.agent.email}`}
                          className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#1378B2] no-underline font-medium justify-center"
                        >
                          ✉️ {routingResult.agent.email}
                        </a>
                      )}
                      {routingResult.agent.phone && (
                        <a
                          href={`tel:${routingResult.agent.phone}`}
                          className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#1378B2] no-underline font-medium justify-center"
                        >
                          📞 {routingResult.agent.phone}
                        </a>
                      )}
                      {routingResult.agent.websiteUrl && (
                        <a
                          href={routingResult.agent.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-[#1378B2] hover:underline font-medium justify-center"
                        >
                          🌐 Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* NO AGENT */}
              {routingResult.status === "no_agent" && (
                <div className="border-2 border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h2
                    className="font-black text-2xl text-slate-900 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    No Agent Available Yet
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6 max-w-md mx-auto">
                    {routingResult.message}
                  </p>
                  <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm inline-block">
                    <p className="text-sm text-slate-600 font-medium">
                      📋 Reference ID:{" "}
                      <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {routingResult.leadId}
                      </code>
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Our team will follow up within 1-2 business days
                    </p>
                  </div>
                </div>
              )}

              {/* DUPLICATE */}
              {routingResult.status === "duplicate" && (
                <div className="border-2 border-blue-200 bg-blue-50 rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-4">ℹ️</div>
                  <h2
                    className="font-black text-xl text-slate-900 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Already Submitted
                  </h2>
                  <p className="text-slate-600">{routingResult.message}</p>
                </div>
              )}

              {/* ERROR */}
              {!routingResult.status && (
                <div className="border-2 border-red-200 bg-red-50 rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h2
                    className="font-black text-xl text-slate-900 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Something Went Wrong
                  </h2>
                  <p className="text-slate-600 mb-5">{routingResult.message}</p>
                  <button
                    onClick={() => {
                      setStep(3);
                      setRoutingResult(null);
                    }}
                    className="bg-[#1378B2] text-white font-bold px-6 py-3 rounded-full"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedCounty(null);
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                    setRoutingResult(null);
                    setForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                    });
                  }}
                  className="text-slate-500 hover:text-[#1378B2] font-semibold text-sm underline"
                >
                  Start a new search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
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
