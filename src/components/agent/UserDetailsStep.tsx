import React from "react";

const UserDetailsStep = ({
  setStep,
  countySearch,
  setCountySearch,
  selectedCounty,
  setSelectedCounty,
  counties,
  products,
  formik,
  extraErrors,
  loading,
  selectedProduct,
  setSelectedProduct,
  setCounties,
  states,
  selectedState,
  setSelectedState,
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
              We match you with agents licensed in your specific state and
              county.
            </p>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  1. Your State
                </label>
                <select
                  value={selectedState?.code || "ALL"}
                  onChange={(e) => {
                    const code = e.target.value;
                    if (code === "ALL") {
                      setSelectedState({ code: "ALL", name: "All States" });
                    } else {
                      const s = states.find((st: any) => st.code === code);
                      setSelectedState(s);
                    }
                    // Reset county on state change
                    setSelectedCounty(null);
                    setCountySearch("");
                    setCounties([]);
                  }}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1.5rem center",
                    backgroundSize: "1.5rem",
                  }}
                >
                  <option value="ALL">All States</option>
                  {states.map((s: any) => (
                    <option key={s.id} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative group">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  2. Your County
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={countySearch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCountySearch(val);
                      // Reset selected county if user starts typing something else
                      if (
                        selectedCounty &&
                        val !==
                          `${selectedCounty.name}, ${selectedCounty.state_abbr}`
                      ) {
                        setSelectedCounty(null);
                      }
                    }}
                    placeholder={
                      selectedState?.code && selectedState?.code !== "ALL"
                        ? `Search in ${selectedState.name}...`
                        : "Search your county (e.g. Miami-Dade)"
                    }
                    className={`w-full pl-6 pr-14 py-4 bg-slate-50 border-2 rounded-2xl text-lg outline-none transition-all
                              ${extraErrors.county ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-brand-gold"}`}
                  />
                  {selectedCounty ? (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <span className="text-brand-accent-green font-bold text-sm hidden sm:block uppercase tracking-wider animate-fade-in">
                        ✓
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCounty(null);
                          setCountySearch("");
                        }}
                        className="w-7 h-7 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    countySearch && (
                      <button
                        onClick={() => {
                          setCountySearch("");
                          setCounties([]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-400 transition-colors"
                      >
                        ✕
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Dropdown */}
            {counties.length > 0 && !selectedCounty && (
              <div className="mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                {counties.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCounty(c);
                      setCounties([]);
                      setCountySearch(`${c.name}, ${c.state_abbr}`);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-brand-gold/10 flex justify-between items-center transition-colors border-b border-slate-50 last:border-0"
                  >
                    <span className="font-bold text-brand-navy">{c.name}</span>
                    <span className="text-sm text-slate-400">
                      {c.state_abbr}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {extraErrors.county && (
              <p className="mt-2 text-red-500 text-xs font-bold uppercase">
                {extraErrors.county}
              </p>
            )}
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
                  className={`px-5 py-3 text-left border-2 rounded-xl text-sm transition-all
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
              },
              {
                id: "lastName",
                label: "Last Name",
                placeholder: "Smith",
              },
              {
                id: "email",
                label: "Email",
                placeholder: "john@example.com",
                type: "email",
              },
              {
                id: "phone",
                label: "Phone",
                placeholder: "(555) 000-0000",
                type: "tel",
              },
            ].map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  {field.label}{" "}
                  {field.id !== "phone" && (
                    <span className="text-red-400">*</span>
                  )}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.id}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={field.placeholder}
                  className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all
                            ${formik.touched[field.id] && formik.errors[field.id] ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-brand-gold"}`}
                />
                {formik.touched[field.id] && formik.errors[field.id] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={formik.handleSubmit}
            disabled={loading}
            className="w-full cursor-pointer bg-brand-navy hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1 mt-10 disabled:opacity-50"
          >
            {loading ? "SEARCHING..." : "GET MATCHED NOW"}
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            By clicking &quot;Get Matched Now&quot;, you agree to our terms.
            Your information is protected and will only be shared with your
            matched licensed professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsStep;
