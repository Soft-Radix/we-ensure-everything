import * as Yup from "yup";
import { PlanType } from "../enum";

/* ── Validation Schemas ───────────────────────────────────────── */

export const step1Schema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  selectedState: Yup.string().required("Required"),
  selectedCounty: Yup.string().required("Required"),
  district: Yup.string().optional(),
  selectedCategory: Yup.string().required("Required"),
});

export const step2Schema = Yup.object().shape({
  streetAddress: Yup.string().required("Street address is required"),
  // city: Yup.string().optional(),
  // state: Yup.string().optional(),
  // country: Yup.string().optional(),
  // postalCode: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  postalCode: Yup.string().required("Postal code is required"),
});

export const step3Schema = Yup.object().shape({
  businessName: Yup.string().required("Business name is required"),
  businessWebsite: Yup.string().url("Invalid URL").optional(),
  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Required"),
});

export const onboardingSchema = Yup.object().shape({
  selectedStates: Yup.array()
    .min(1, "Select at least one state")
    .required("Required"),
  selectedCounties: Yup.array().when("planType", {
    is: (val: string) => val !== PlanType.AGENT_PRO_PLUS,
    then: (schema) =>
      schema.min(1, "Select at least one county").required("Required"),
    otherwise: (schema) => schema.optional(),
  }),
  selectedCategories: Yup.array()
    .min(1, "Select at least one category")
    .required("Required"),
  selectedProducts: Yup.array().when("planType", {
    is: PlanType.REFFERAL_PRO,
    then: (schema) =>
      schema.min(1, "Select at least one product").required("Required"),
    otherwise: (schema) => schema.optional(),
  }),
});

export const addKeySchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  apiKey: Yup.string()
    .min(10, "API Key is too short")
    .required("API Key is required"),
  // confirmApiKey: Yup.string()
  //   .oneOf([Yup.ref("apiKey")], "API Keys must match")
  //   .required("Please confirm your API Key"),
});
