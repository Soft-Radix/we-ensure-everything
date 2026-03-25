import { Step } from "@/lib/data/categories";

const imagesArray = [
  "/icons/vehicle.png",
  "/icons/property.png",
  "/icons/health.png",
  "/icons/life.png",
  "/icons/commercial.png",
  "/icons/niche.png",
];
const CoverageStep = ({
  setSelectedCategory,
  setStep,
  categories,
}: {
  setSelectedCategory: (category: any) => void;
  setStep: (step: Step) => void;
  categories: any[];
}) => {
  return (
    <div className="p-10 md:p-10 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-black text-brand-navy mb-4">
          What kind of coverage do you need?
        </h2>
        <p className="text-slate-500">
          Select a category to begin your match process.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <button
              key={cat.code}
              onClick={() => {
                setSelectedCategory(cat);
                setStep(2);
              }}
              className="group flex flex-col items-center gap-4 p-8 text-center border-2 border-slate-100 rounded-3xl hover:border-brand-gold hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-16 h-16 group-hover:scale-110 transition-transform">
                <img
                  src={imagesArray[index % imagesArray.length]}
                  alt={cat.name}
                  // width={64}
                  // height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-heading font-bold text-brand-navy text-lg group-hover:text-brand-gold transition-colors">
                {cat.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverageStep;
