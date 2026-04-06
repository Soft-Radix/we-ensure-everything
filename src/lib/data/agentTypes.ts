/* ── Types ───────────────────────────────────────────────────── */
export interface County {
  id: number;
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
export interface MultiSelectProps {
  label: string;
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  placeholder?: string;
}
export interface SingleSelectProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}
