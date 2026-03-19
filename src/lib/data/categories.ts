export interface Product {
  code: string;
  name: string;
}

export interface Category {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  products: Product[];
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    code: "COMMERCIAL",
    name: "Commercial Insurance",
    icon: "🏢",
    description: "Comprehensive coverage for businesses of all sizes",
    products: [
      { code: "BOP", name: "Business Owners Policy (BOP)" },
      { code: "GL", name: "General Liability" },
      { code: "WC", name: "Workers' Compensation" },
      { code: "COMM_AUTO", name: "Commercial Auto" },
      { code: "PROP", name: "Commercial Property" },
      { code: "CYBER", name: "Cyber Liability" },
      { code: "EPLI", name: "Employment Practices Liability" },
      { code: "PROF", name: "Professional Liability / E&O" },
      { code: "SURETY", name: "Surety Bonds" },
      { code: "MARINE", name: "Inland Marine" },
      { code: "EXCESS", name: "Excess & Umbrella" },
    ],
  },
  {
    id: 2,
    code: "HEALTH",
    name: "Health, Life & Disability",
    icon: "🏥",
    description: "Individual and group health, life, and disability solutions",
    products: [
      { code: "IND_HEALTH", name: "Individual Health" },
      {
        code: "HEALTH_1099",
        name: "Health for Independent Contractors & 1099s",
      },
      { code: "LIFE", name: "Life Insurance" },
      { code: "DISABILITY", name: "Disability Insurance" },
      { code: "LTC", name: "Long-Term Care (LTC)" },
      { code: "ANNUITIES", name: "Annuities" },
      { code: "DENTAL", name: "Dental & Vision" },
      { code: "CRITICAL", name: "Critical Illness" },
      { code: "ACCIDENT", name: "Accident Insurance" },
      { code: "HOSPITAL", name: "Hospital Indemnity" },
    ],
  },
  {
    id: 3,
    code: "PERSONAL",
    name: "Personal Insurance",
    icon: "🏠",
    description: "Auto, home, and personal lines coverage",
    products: [
      { code: "HOME", name: "Homeowners Insurance" },
      { code: "AUTO", name: "Personal Auto" },
      { code: "RENTERS", name: "Renters Insurance" },
      { code: "UMBRELLA", name: "Personal Umbrella" },
      { code: "BOAT", name: "Boat & Watercraft" },
      { code: "RV", name: "RV & Motorsports" },
      { code: "CONDO", name: "Condo Insurance" },
      { code: "FLOOD", name: "Flood Insurance" },
      { code: "EARTHQUAKE", name: "Earthquake Insurance" },
      { code: "JEWELRY", name: "Jewelry & Valuables" },
    ],
  },
  {
    id: 4,
    code: "MEDICARE",
    name: "Medicare & Senior",
    icon: "👴",
    description: "Medicare supplements and senior care solutions",
    products: [
      { code: "MED_SUPP", name: "Medicare Supplement (Medigap)" },
      { code: "MED_ADV", name: "Medicare Advantage (Part C)" },
      { code: "PART_D", name: "Medicare Part D (Prescription)" },
      { code: "FINAL_EXP", name: "Final Expense / Burial Insurance" },
      { code: "SNP", name: "Special Needs Plans (SNP)" },
      { code: "DSNP", name: "Dual Eligible SNP (D-SNP)" },
      { code: "NURSING", name: "Nursing Home / Facility Care" },
      { code: "HOME_CARE", name: "Home Health Care Coverage" },
    ],
  },
  {
    id: 5,
    code: "FINANCIAL",
    name: "Financial & Legal",
    icon: "📊",
    description: "Financial protection and legal expense coverage",
    products: [
      { code: "IUL", name: "Indexed Universal Life (IUL)" },
      { code: "WHOLE", name: "Whole Life Insurance" },
      { code: "TERM", name: "Term Life Insurance" },
      { code: "FIXED_ANN", name: "Fixed Annuities" },
      { code: "VARIABLE", name: "Variable Annuities" },
      { code: "LEGAL", name: "Legal Expense Insurance" },
      { code: "ID_THEFT", name: "Identity Theft Protection" },
      { code: "401K", name: "401(k) Rollover / IRA" },
      { code: "WEALTH", name: "Wealth Management & Protection" },
    ],
  },
  {
    id: 6,
    code: "GROUP",
    name: "Group Benefits",
    icon: "👥",
    description: "Employee benefits and group administration",
    products: [
      { code: "GROUP_HEALTH", name: "Group Health Insurance" },
      { code: "GROUP_LIFE", name: "Group Life Insurance" },
      { code: "GROUP_DENTAL", name: "Group Dental & Vision" },
      { code: "GROUP_DIS", name: "Group Disability Insurance" },
      { code: "GROUP_401K", name: "Group 401(k) Plans" },
      { code: "HRA", name: "Health Reimbursement Arrangements (HRA)" },
      { code: "HSA", name: "Health Savings Accounts (HSA)" },
      { code: "FSA", name: "Flexible Spending Accounts (FSA)" },
      { code: "COBRA", name: "COBRA Administration" },
      { code: "WELLNESS", name: "Employee Wellness Programs" },
      { code: "VOLUNTARY", name: "Voluntary Benefits" },
    ],
  },
];

export function getCategoryByCode(code: string): Category | undefined {
  return CATEGORIES.find((c) => c.code === code);
}

export function getProductByCode(
  categoryCode: string,
  productCode: string,
): Product | undefined {
  const category = getCategoryByCode(categoryCode);
  return category?.products.find((p) => p.code === productCode);
}
