import React from "react";
import SingleSelect from "@/components/agent/SingleSelect";
import { Mail, Phone, User } from "lucide-react";

const UserDetailsStep = ({
  setStep,
  selectedCounty,
  setSelectedCounty,
  counties,
  products,
  formik,
  extraErrors,
  loading,
  selectedProduct,
  setSelectedProduct,
  states,
  selectedState,
  setSelectedState,
  agents,
}: any) => {
  return (
    <div className="p-10 md:p-10 animate-fade-in">
      <button
        onClick={() => setStep(1)}
        className="mb-8 text-slate-400 hover:text-brand-navy flex items-center gap-2 font-bold text-sm"
      >
        ← Back to Categories
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-heading font-black text-brand-navy mb-4">
              Where are you located?
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              We connect you with our licensed agents in your specific state and
              county who can serve your area.
            </p>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <SingleSelect
                  label="1. Your State"
                  placeholder="Search state..."
                  options={states.map((s: any) => ({
                    label: s.name,
                    value: s.code,
                  }))}
                  value={
                    selectedState?.code && selectedState.code !== "ALL"
                      ? selectedState.code
                      : ""
                  }
                  onChange={(code) => {
                    if (!code) {
                      setSelectedState(null);
                    } else {
                      const s = states.find((st: any) => st.code === code);
                      setSelectedState(s);
                    }
                    // Reset county on state change (parent useEffect refetches counties)
                    setSelectedCounty(null);
                  }}
                />
              </div>

              <div>
                <SingleSelect
                  label="2. Your County"
                  placeholder={
                    selectedState?.code && selectedState?.code !== "ALL"
                      ? `Search in ${selectedState.name}...`
                      : "Search your county (e.g. Miami-Dade)"
                  }
                  options={counties.map((c: any) => ({
                    label: `${c.name}, ${c.state_abbr}`,
                    value: String(c.id),
                  }))}
                  value={selectedCounty ? String(selectedCounty.id) : ""}
                  onChange={(id) => {
                    if (!id) {
                      setSelectedCounty(null);
                    } else {
                      const c = counties.find((c: any) => String(c.id) === id);
                      if (c) setSelectedCounty(c);
                    }
                  }}
                  error={extraErrors.county}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-heading font-black text-brand-navy mb-4">
              Specific Product
            </h3>
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
              {products.map((p: any) => (
                <button
                  key={p.code}
                  onClick={() => setSelectedProduct(p)}
                  className={`px-5 cursor-pointer py-3 text-left border-1 rounded-xl text-sm transition-all
                            ${
                              selectedProduct?.code === p.code
                                ? "border-brand-gold bg-brand-gold/5 font-bold text-brand-navy shadow-sm"
                                : "border-slate-100 text-slate-500 hover:border-slate-200"
                            }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            {extraErrors.product && (
              <p className="mt-2 text-red-500 text-xs font-bold uppercase">
                {extraErrors.product}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-heading font-black text-brand-navy mb-4">
            Your Contact Info
          </h2>
          <div className="space-y-5">
            {[
              {
                id: "firstName",
                label: "First Name",
                placeholder: "John",
                icon: <User className="w-5 h-5" />,
              },
              {
                id: "lastName",
                label: "Last Name",
                placeholder: "Smith",
                icon: <User className="w-5 h-5" />,
              },
              {
                id: "email",
                label: "Email",
                placeholder: "john@example.com",
                icon: <Mail className="w-5 h-5" />,
                type: "email",
              },
              {
                id: "phone",
                label: "Phone",
                placeholder: "(555) 000-0000",
                icon: <Phone className="w-5 h-5" />,
                type: "tel",
              },
            ].map((field) => (
              <div key={field.id}>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">
                  {field.label}{" "}
                  {field.id !== "phone" && (
                    <span className="text-red-400">*</span>
                  )}
                </label>

                <div className="relative">
                  {field.icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {field.icon}
                    </div>
                  )}
                  <input
                    type={field.type || "text"}
                    name={field.id}
                    value={formik.values[field.id]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={field.placeholder}
                    className={`w-full pl-12 pr-4 py-4  border border-slate-200 rounded-2xl outline-none transition-all
                            ${formik.touched[field.id] && formik.errors[field.id] ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-brand-gold"}`}
                  />
                </div>
                {formik.touched[field.id] && formik.errors[field.id] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors[field.id]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <SingleSelect
                label="Referred By (Optional)"
                placeholder="Search agent name..."
                options={agents.map((agent: any) => ({
                  label: agent.full_name,
                  value: String(agent.id),
                }))}
                value={String(formik.values.referredBy ?? "")}
                onChange={(val) => formik.setFieldValue("referredBy", val)}
              />
            </div>
          </div>

          <button
            onClick={formik.handleSubmit}
            disabled={loading}
            className="w-full cursor-pointer bg-brand-navy hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 mt-10 disabled:opacity-50"
          >
            {loading ? "SEARCHING..." : "MEET YOUR LOCAL AGENT"}
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            By clicking &quot;Meet Your Local Agent&quot;, you agree to our
            terms. Your information is protected and will only be shared with
            your licensed local professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsStep;
