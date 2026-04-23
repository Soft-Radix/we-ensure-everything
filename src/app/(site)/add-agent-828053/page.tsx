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
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Category, County } from "@/lib/data/agentTypes";
import SingleSelect from "@/components/agent/SingleSelect";
import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/lib/schema/agentSchema";
import {
  currentStepInfo,
  demoPage,
  paymentDEVPage,
  paymentPage,
} from "@/lib/data/static";
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
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(10);

  const formik = useFormik({
    initialValues: {
      // Step 1
      fullName: "",
      email: "",
      phone: "",
      selectedState: "",
      selectedCounty: "",
      district: "",
      selectedCategory: "",
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
      if (step === 1) {
        setLoading(true);
        const unique = await isNewAgent();
        setLoading(false);
        if (!unique) return;
      } else if (step < 3) {
        setStep(step + 1);
      } else {
        setLoading(true);
        try {
          const res = await fetch("/api/agents/licensed-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...values,
              selectedCounties: [values.selectedCounty],
            }),
          });
          const data = await res.json();
          if (data.success) {
            // Check availability
            const selectedCategoryObj = categoriesList.find(
              (c) => c.code === values.selectedCategory,
            );
            const checkRes = await fetch("/api/onboarding/check-availability", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planType: "agent_pro",
                selectedStates: [values.selectedState],
                selectedCounties: [values.selectedCounty],
                selectedCategories: selectedCategoryObj
                  ? [selectedCategoryObj.id.toString()]
                  : [],
              }),
            });
            const checkData = await checkRes.json();

            setIsAvailable(checkData.isAvailable);
            setShowStatus(true);
            toast.success("Registration step 1 complete!");
          } else {
            toast.error("Failed to process registration: " + data.error);
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

  // Timer for redirection
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showStatus && isAvailable && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (showStatus && isAvailable && timer === 0) {
      if (process.env.NODE_ENV !== "development") {
        const paymentUrl = paymentDEVPage;
        window.location.href = paymentUrl;
      } else {
        const paymentUrl = paymentPage;
        window.location.href = paymentUrl;
      }
    }
    return () => clearInterval(interval);
  }, [showStatus, isAvailable, timer]);

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

  // Fetch counties when selected state changes
  useEffect(() => {
    if (!formik.values.selectedState) {
      setCountiesList([]);
      return;
    }

    const fetchCounties = async () => {
      setLoadingCounties(true);
      try {
        const res = await fetch(
          `/api/counties?states=${formik.values.selectedState}&limit=500`,
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
  }, [formik.values.selectedState]);

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const isNewAgent = async () => {
    if (!step1Schema.isValidSync(formik.values)) {
      return false;
    }
    try {
      const res = await fetch("/api/agents/exiting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formik.values.email,
          phone: formik.values.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        return true;
      } else {
        toast.error(data.error);
        return false;
      }
    } catch (err) {
      toast.error("Error fetching agent status");
      console.error("Error fetching agent status", err);
      return false;
    }
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

            {showStatus ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                {isAvailable ? (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-heading font-black text-slate-900">
                      Seat is Available!
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto text-lg leading-relaxed">
                      Great news! Your selected territory is open. We are
                      preparing your secure payment link.
                    </p>
                    <div className="inline-flex items-center gap-3 bg-brand-gold/10 text-brand-navy px-8 py-4 rounded-2xl font-bold">
                      <Clock className="animate-pulse" size={20} />
                      Redirecting to payment in{" "}
                      <span className="text-xl inline-block w-8 font-black">
                        {timer}
                      </span>{" "}
                      seconds...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-heading font-black text-slate-900">
                      Waitlist Notification
                    </h3>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 max-w-md mx-auto">
                      <p className="text-slate-600 text-lg leading-relaxed">
                        The seat for your selected territory is currently{" "}
                        <span className="font-bold text-slate-900">
                          occupied
                        </span>
                        . Don&apos;t worry, you&apos;ve been added to our
                        exclusive waitlist!
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                      >
                        Try Another Territory
                      </button>
                      <a
                        href={demoPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-navy text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        <Calendar size={20} />
                        Book a Live Demo
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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

                    <SingleSelect
                      label="What state are you licensed in? *"
                      options={statesList.map((s) => ({
                        label: s.name,
                        value: s.code,
                      }))}
                      value={formik.values.selectedState}
                      onChange={(val) => {
                        formik.setFieldValue("selectedCounty", "");
                        formik.setFieldValue("selectedState", val);
                      }}
                      error={
                        formik.touched.selectedState
                          ? (formik.errors.selectedState as string)
                          : ""
                      }
                      placeholder="Select state..."
                    />

                    <SingleSelect
                      label="What County Are You In? *"
                      options={countiesList.map((c) => ({
                        label: `${c.name}, ${c.state_abbr}`,
                        value: c.id.toString(),
                      }))}
                      value={formik.values.selectedCounty}
                      onChange={(val) =>
                        formik.setFieldValue("selectedCounty", val)
                      }
                      error={
                        formik.touched.selectedCounty
                          ? (formik.errors.selectedCounty as string)
                          : ""
                      }
                      placeholder={
                        loadingCounties
                          ? "Loading counties..."
                          : "Select county..."
                      }
                    />

                    <div className="col-span-2">
                      <SingleSelect
                        label="Type of Coverage *"
                        options={categoriesList.map((c) => ({
                          label: c.name,
                          value: c.code,
                        }))}
                        value={formik.values.selectedCategory}
                        onChange={(val) => {
                          formik.setFieldValue("selectedCategory", val);
                        }}
                        error={
                          formik.touched.selectedCategory
                            ? (formik.errors.selectedCategory as string)
                            : ""
                        }
                        placeholder="Select coverage type..."
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: BUSINESS ADDRESS */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* <div>
                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Search for your business address..."
                      className=" w-full p-4 rounded-xl border border-slate-200 focus:border-brand-gold bg-white outline-none"
                    />
                  </div> */}

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
                          City *
                        </label>
                        <input
                          className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                          placeholder="New York"
                          {...formik.getFieldProps("city")}
                        />
                        {formik.touched.city && formik.errors.city && (
                          <p className="text-red-500 text-xs mt-1 absolute">
                            {formik.errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">
                          State *
                        </label>
                        <input
                          className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                          placeholder="NY"
                          {...formik.getFieldProps("state")}
                        />
                        {formik.touched.state && formik.errors.state && (
                          <p className="text-red-500 text-xs mt-1 absolute">
                            {formik.errors.state}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">
                          Country *
                        </label>
                        <input
                          className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                          placeholder="United States"
                          {...formik.getFieldProps("country")}
                        />
                        {formik.touched.country && formik.errors.country && (
                          <p className="text-red-500 text-xs mt-1 absolute">
                            {formik.errors.country}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-2 text-sm">
                          Postal Code *
                        </label>
                        <input
                          className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none"
                          placeholder="10001"
                          {...formik.getFieldProps("postalCode")}
                        />
                        {formik.touched.postalCode &&
                          formik.errors.postalCode && (
                            <p className="text-red-500 text-xs mt-1 absolute">
                              {formik.errors.postalCode}
                            </p>
                          )}
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
                            I have read and agree to the Privacy Policy as well
                            as the Terms & Conditions provided by the AgentPro!.
                          </label>
                        </div>
                      </div>
                      <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                        <ShieldCheck
                          size={27}
                          className="text-brand-gold  shrink-0 mt-0.5"
                        />
                        By providing my phone number, I agree to receive text
                        messages and emails from the AgentPro!. Reply STOP to
                        opt out.
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
                    className="flex cursor-pointer items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-black px-10 py-5 rounded-full transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
