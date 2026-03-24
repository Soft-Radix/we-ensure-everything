/* ── Types ───────────────────────────────────────────────────── */
export interface County {
  id: number;
  fips_code: string;
  name: string;
  state: string;
  state_abbr: string;
}
export interface Category {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}
export interface Product {
  code: string;
  name: string;
}
export interface Agent {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  bio?: string;
  websiteUrl?: string;
  licenseState?: string;
}
export type RoutingStatus = "assigned" | "no_agent" | "duplicate" | null;
