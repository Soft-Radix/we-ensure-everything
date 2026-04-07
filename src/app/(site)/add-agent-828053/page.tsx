"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Category, County, Product } from "@/lib/data/agentTypes";
import MultiSelect from "@/components/agent/Multiselect";
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/lib/schema/agentSchema";
import { currentStepInfo } from "@/lib/data/static";
import AddAgentHeader from "@/components/agent/AddAgentHeader";
import toast from "react-hot-toast";

export default function AddAgentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statesList, setStatesList] = useState<
    { id: string; code: string; name: string }[]
  >([]);
  const [countiesList, setCountiesList] = useState<County[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingCounties, setLoadingCounties] = useState(false);

  const formik = useFormik({
    initialValues: {
      // Step 1
      fullName: "",
      email: "",
      phone: "",
      selectedStates: [] as string[],
      selectedCounties: [] as string[],
      district: "",
      selectedCategories: [] as string[],
      selectedProducts: [] as string[],
      // Step 2
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      // Step 3
      businessName: "",
      businessWebsite: "",
      termsAccepted: false,
    },
    validationSchema:
      step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema,
    onSubmit: async (values) => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setLoading(true);
        try {
          const res = await fetch("/api/agents/onboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (data.success) {
            toast.success("Agent onboarded successfully!");
            formik.resetForm();
            setStep(1);
          } else {
            toast.error("Failed to onboard agent: " + data.error);
          }
        } catch (err) {
          console.error("Onboarding error:", err);
          toast.error("Failed to onboard agent: " + err);
        } finally {
          setLoading(false);
        }
      }
    },
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesRes, catsRes] = await Promise.all([
          fetch("/api/states"),
          fetch("/api/categories"),
        ]);
        const statesData = await statesRes.json();
        const catsData = await catsRes.json();
        setStatesList(statesData.states || []);
        setCategoriesList(catsData.categories || []);
      } catch (err) {
        console.error("Error fetching initial data", err);
      }
    };
    fetchData();
  }, []);

  // Fetch counties when selected states change
  useEffect(() => {
    if (formik.values.selectedStates.length === 0) {
      setCountiesList([]);
      return;
    }

    const fetchCounties = async () => {
      setLoadingCounties(true);
      try {
        // Since the states API might support multiple, but we have individual ones,
        // we'll fetch for each or use a query that supports multiples if available.
        // For now, let's assume we can query by a comma separated list of state codes.
        const res = await fetch(
          `/api/counties?states=${formik.values.selectedStates.join(",")}&limit=500`,
        );
        const data = await res.json();
        setCountiesList(data.counties || []);
      } catch (err) {
        console.error("Error fetching counties", err);
      } finally {
        setLoadingCounties(false);
      }
    };

    fetchCounties();
  }, [formik.values.selectedStates]);

  // Fetch products when selected categories change
  useEffect(() => {
    if (formik.values.selectedCategories.length === 0) {
      setProductsList([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        // Fetch products for all selected categories
        const productsPromises = formik.values.selectedCategories.map(
          (catCode) =>
            fetch(`/api/categories/${catCode}/products`).then((r) => r.json()),
        );
        const results = await Promise.all(productsPromises);
        const allProducts = results.flatMap((r) => r.products || []);
        // Remove duplicates just in case
        const uniqueProducts = Array.from(
          new Map(allProducts.map((p) => [p.code, p])).values(),
        );
        setProductsList(uniqueProducts);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchProducts();
  }, [formik.values.selectedCategories]);

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-brand-navy pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 skew-x-12 transform translate-x-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Become an <span className="text-brand-gold">AgentPro!</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Join the elite circle of insurance professionals and start receiving
            qualified local leads today.
          </p>
        </div>
      </div>

      {/* Glassmorphism Stepper Card */}
      <div className="max-w-4xl mx-auto px-6 -mt-24 pb-20">
        <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden backdrop-blur-xl">
          <AddAgentHeader step={step} />
          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                {currentStepInfo(step).title}
              </h2>
              <p className="text-slate-500">{currentStepInfo(step).sub}</p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              {/* STEP 1: CREDENTIALS */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Full Name*
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all outline-none ${formik.touched.fullName && formik.errors.fullName ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"}`}
                        placeholder="John Doe"
                        {...formik.getFieldProps("fullName")}
                      />
                    </div>
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 absolute">
                        {formik.errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Email Address*
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all outline-none ${formik.touched.email && formik.errors.email ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"}`}
                        placeholder="john@example.com"
                        {...formik.getFieldProps("email")}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-xs mt-1 absolute">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Phone Number*
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all outline-none ${formik.touched.phone && formik.errors.phone ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"}`}
                        placeholder="(555) 000-0000"
                        {...formik.getFieldProps("phone")}
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-500 text-xs mt-1 absolute">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      District (Optional)
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                        placeholder="Eastern District"
                        {...formik.getFieldProps("district")}
                      />
                    </div>
                  </div>

                  <MultiSelect
                    label="What state are you licensed in? *"
                    options={statesList.map((s) => ({
                      label: s.name,
                      value: s.code,
                    }))}
                    selected={formik.values.selectedStates}
                    onChange={(vals) =>
                      formik.setFieldValue("selectedStates", vals)
                    }
                    error={
                      formik.touched.selectedStates
                        ? (formik.errors.selectedStates as string)
                        : ""
                    }
                    placeholder="Select states..."
                  />

                  <MultiSelect
                    label="What County Are You In? *"
                    showSelectAll
                    options={countiesList.map((c) => ({
                      label: `${c.name}, ${c.state_abbr}`,
                      value: c.id.toString(),
                    }))}
                    selected={formik.values.selectedCounties}
                    onChange={(vals) =>
                      formik.setFieldValue("selectedCounties", vals)
                    }
                    error={
                      formik.touched.selectedCounties
                        ? (formik.errors.selectedCounties as string)
                        : ""
                    }
                    placeholder={
                      loadingCounties
                        ? "Loading counties..."
                        : "Select counties..."
                    }
                  />

                  <MultiSelect
                    label="Type of Coverage *"
                    options={categoriesList.map((c) => ({
                      label: c.name,
                      value: c.code,
                    }))}
                    selected={formik.values.selectedCategories}
                    onChange={(vals) =>
                      formik.setFieldValue("selectedCategories", vals)
                    }
                    error={
                      formik.touched.selectedCategories
                        ? (formik.errors.selectedCategories as string)
                        : ""
                    }
                    placeholder="Select coverage types..."
                  />

                  <MultiSelect
                    label="Specific Product *"
                    options={productsList.map((p) => ({
                      label: p.name,
                      value: p.code,
                    }))}
                    selected={formik.values.selectedProducts}
                    onChange={(vals) =>
                      formik.setFieldValue("selectedProducts", vals)
                    }
                    error={
                      formik.touched.selectedProducts
                        ? (formik.errors.selectedProducts as string)
                        : ""
                    }
                    placeholder="Select products..."
                  />
                </div>
              )}

              {/* STEP 2: BUSINESS ADDRESS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Search for your business address..."
                      className=" w-full p-4 rounded-xl border border-slate-200 focus:border-brand-gold bg-white outline-none"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Street Address *
                    </label>
                    <input
                      className={`w-full px-6 py-4 rounded-xl border transition-all outline-none ${formik.touched.streetAddress && formik.errors.streetAddress ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"}`}
                      placeholder="123 Business Way"
                      {...formik.getFieldProps("streetAddress")}
                    />
                    {formik.touched.streetAddress &&
                      formik.errors.streetAddress && (
                        <p className="text-red-500 text-xs mt-1 absolute">
                          {formik.errors.streetAddress}
                        </p>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2 text-sm">
                        City (Optional)
                      </label>
                      <input
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                        placeholder="New York"
                        {...formik.getFieldProps("city")}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2 text-sm">
                        State (Optional)
                      </label>
                      <input
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                        placeholder="NY"
                        {...formik.getFieldProps("state")}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2 text-sm">
                        Country (Optional)
                      </label>
                      <input
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                        placeholder="United States"
                        {...formik.getFieldProps("country")}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2 text-sm">
                        Postal Code (Optional)
                      </label>
                      <input
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                        placeholder="10001"
                        {...formik.getFieldProps("postalCode")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: GENERAL INFO */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Business Name *
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all outline-none ${formik.touched.businessName && formik.errors.businessName ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"}`}
                        placeholder="Agency Name LLC"
                        {...formik.getFieldProps("businessName")}
                      />
                    </div>
                    {formik.touched.businessName &&
                      formik.errors.businessName && (
                        <p className="text-red-500 text-xs mt-1 absolute">
                          {formik.errors.businessName}
                        </p>
                      )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Business Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                        placeholder="https://www.youragency.com"
                        {...formik.getFieldProps("businessWebsite")}
                      />
                    </div>
                    {formik.touched.businessWebsite &&
                      formik.errors.businessWebsite && (
                        <p className="text-red-500 text-xs mt-1 absolute">
                          {formik.errors.businessWebsite}
                        </p>
                      )}
                  </div>

                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mt-10">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center h-6">
                        <input
                          id="termsAccepted"
                          name="termsAccepted"
                          type="checkbox"
                          className="h-5 w-5 rounded border-slate-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                          checked={formik.values.termsAccepted}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      <div className="text-sm leading-relaxed text-slate-600">
                        <label
                          htmlFor="termsAccepted"
                          className="font-medium text-brand-navy cursor-pointer"
                        >
                          I have read and agree to the Privacy Policy as well as
                          the Terms & Conditions provided by the AgentPro!.
                        </label>
                      </div>
                    </div>
                    <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                      <ShieldCheck
                        size={27}
                        className="text-brand-gold  shrink-0 mt-0.5"
                      />
                      By providing my phone number, I agree to receive text
                      messages and emails from the AgentPro!. Reply STOP to opt
                      out.
                    </p>
                    {formik.touched.termsAccepted &&
                      formik.errors.termsAccepted && (
                        <p className="text-red-500 text-xs mt-2">
                          {formik.errors.termsAccepted as string}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-12 flex items-center justify-between pt-10 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <ChevronLeft size={20} />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-black px-10 py-5 rounded-full transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="spinner border-2 w-5 h-5 border-white border-t-transparent" />
                  ) : step < 3 ? (
                    <>
                      Continue
                      <ChevronRight size={20} />
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2026 AgentPro! Marketplace. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">
            <a href="#" className="hover:text-brand-gold">
              Security
            </a>
            <a href="#" className="hover:text-brand-gold">
              Privacy
            </a>
            <a href="#" className="hover:text-brand-gold">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
