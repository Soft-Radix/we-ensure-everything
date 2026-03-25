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
export type Step = 1 | 2 | 3;
export const CATEGORIES: Category[] = [
  {
    id: 1,
    code: "AUTO_VEHICLE",
    name: "Auto & Vehicle",
    icon: "/icons/personal.png",
    description:
      "Coverage for cars, trucks, motorcycles, and other personal use vehicles",
    products: [
      { code: "AUTO", name: "Auto" },
      { code: "BUSINESS_AUTO", name: "Business Auto" },
      { code: "CLASSIC_CAR", name: "Classic Car" },
      { code: "MOTORCYCLE", name: "Motorcycle" },
      { code: "OFF_ROAD", name: "Off Road Vehicle" },
      { code: "RV", name: "RV" },
      { code: "SR22", name: "SR-22" },
      { code: "SNOWMOBILE", name: "Snowmobile" },
      { code: "WATERCRAFT", name: "Watercraft" },
      { code: "YACHT", name: "Yacht" },
    ],
  },
  {
    id: 2,
    code: "PROPERTY_CASUALTY",
    name: "Property & Casualty",
    icon: "/icons/personal.png",
    description: "General property, liability, and personal asset protection",
    products: [
      { code: "CONDO", name: "Condo" },
      { code: "FLOOD", name: "Flood" },
      { code: "HOME", name: "Home" },
      { code: "HOME_AUTO", name: "Home & Auto" },
      { code: "HOME_WARRANTY", name: "Home Warranty" },
      { code: "LANDLORD_RENTAL", name: "Landlord & Rental Prop" },
      { code: "MOBILE_HOME", name: "Mobile Home" },
      { code: "RENTAL_PROP", name: "Rental Property" },
      { code: "RENTER", name: "Renter" },
      { code: "SECONDARY_HOME", name: "Secondary Home" },
      { code: "SHORT_TERM_RENTAL", name: "Short Term Rental" },
      { code: "SINKHOLE", name: "Sinkhole" },
      { code: "UMBRELLA", name: "Umbrella" },
      { code: "VACANT_HOME", name: "Vacant Home" },
      { code: "VALUABLE_POSS", name: "Valuable Possessions" },
    ],
  },
  {
    id: 3,
    code: "HEALTH",
    name: "Health",
    icon: "/icons/health.png",
    description: "Individual and group health insurance solutions",
    products: [
      { code: "FSA", name: "FSA" },
      { code: "HAS", name: "HSA (HAS)" },
      { code: "HRA", name: "HRA" },
      { code: "GROUP_ACCIDENT", name: "Group Accident" },
      { code: "GROUP_DENTAL", name: "Group Dental" },
      { code: "GROUP_HEALTH", name: "Group Health" },
      { code: "GROUP_HOSPITAL", name: "Group Hospital" },
      { code: "GROUP_TELEMEDICINE", name: "Group Telemedicine" },
      { code: "GROUP_VISION", name: "Group Vision" },
      { code: "INDIV_DENTAL", name: "Indiv Dental" },
      { code: "INDIV_TELEMEDICINE", name: "Indiv Telemedicine" },
      { code: "INDIV_VISION", name: "Indiv Vision" },
      { code: "MEDICARE", name: "Medicare" },
      { code: "GROUP_VOLUNTARY", name: "Group Voluntary Benefits" },
    ],
  },
  {
    id: 4,
    code: "LIFE_DISABILITY",
    name: "Life & Disability",
    icon: "/icons/health.png",
    description:
      "Life insurance, disability protection, and income safety nets",
    products: [
      { code: "401K", name: "401K" },
      { code: "ANNUITIES", name: "Annuities" },
      { code: "IRA", name: "IRA" },
      { code: "CHILD_LIFE", name: "Child Life" },
      { code: "CRITICAL_ILLNESS", name: "Critical Illness" },
      { code: "DISABILITY", name: "Disability" },
      { code: "GROUP_SUPP_LIFE", name: "Group Supplemental Life" },
      { code: "INDIV_LIFE", name: "Indiv Life" },
      { code: "KEY_PERSON", name: "Key Person Life" },
      { code: "LIFE_AD_D", name: "Life and AD&D" },
      { code: "LTC", name: "LTC" },
      { code: "LTD", name: "LTD" },
      { code: "MORTGAGE_PROT", name: "Mortgage Protection" },
    ],
  },
  {
    id: 5,
    code: "BUSINESS_COMMERCIAL",
    name: "Business & Commercial",
    icon: "/icons/commercial.png",
    description: "Multi-line coverage for businesses of all sizes",
    products: [
      { code: "BUILDERS_RISK", name: "Builders Risk" },
      { code: "BUSINESS_INTERRUPTION", name: "Business Interruption" },
      { code: "BOP", name: "Business owners" },
      { code: "CAPTIVE", name: "Captive Insurance" },
      { code: "COMM_BONDS", name: "Commercial Bonds" },
      { code: "COMM_CONSTRUCTION", name: "Commercial Construction" },
      { code: "COMM_HURRICANE", name: "Commercial Hurricane" },
      { code: "COMM_PROPERTY", name: "Commercial Property" },
      { code: "COMM_UMBRELLA", name: "Commercial Umbrella" },
      { code: "CRIME", name: "Crime" },
      { code: "CYBER", name: "Cyber Liability" },
      { code: "D_O", name: "Directors & Officers Liability" },
      { code: "E_O", name: "E&O" },
      { code: "EAP", name: "Employee Assist Plan" },
      { code: "EPLI", name: "Employment Practice Liability" },
      { code: "ENVIRONMENTAL", name: "Environmental" },
      { code: "EXCESS_LIABILITY", name: "Excess Liability" },
      { code: "FIDUCIARY", name: "Fiduciary Liability" },
      { code: "GEN_LIABILITY", name: "Gen Liability" },
      { code: "INLAND_MARINE", name: "Inland Marine" },
      { code: "LIQUOR_LIABILITY", name: "Liquor Liability" },
      { code: "OCEAN_MARINE", name: "Ocean Marine" },
      { code: "PAYROLL_HR", name: "Payroll/HR" },
      { code: "RISK_MGMT", name: "Risk Management" },
      { code: "SURETY_BOND", name: "Surety Bond" },
      { code: "SYSTEMS_BREAKDOWN", name: "Systems Breakdown" },
      { code: "WORKERS_COMP", name: "Workers Comp" },
    ],
  },
  {
    id: 6,
    code: "NICHE_SPECIALTY",
    name: "Niche & Specialty",
    icon: "/icons/legal.png",
    description:
      "Highly specialized and unique insurance coverage for specific industries",
    products: [
      { code: "DEBT_SETTLEMENT", name: "Debt Settlement" },
      { code: "EVENT", name: "Event" },
      { code: "SPECIAL_EVENT", name: "Special Event" },
      { code: "WEDDING", name: "Wedding" },
      { code: "IDENTITY_THEFT", name: "Identity Theft" },
      { code: "LEGAL", name: "Legal" },
      { code: "TAX_ADVISORY", name: "Tax Advisory" },
      { code: "NATURAL_DISASTER", name: "Natural Disaster" },
      { code: "PET", name: "Pet" },
      { code: "PROBATE_BOND", name: "Probate Bond" },
      { code: "TRAVEL", name: "Travel" },
      { code: "VACANT_BUILDING", name: "Vacant Building" },
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
