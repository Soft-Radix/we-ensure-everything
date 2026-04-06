import * as Yup from "yup";

/* ── Validation Schemas ───────────────────────────────────────── */

export const step1Schema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  selectedStates: Yup.array()
    .min(1, "Select at least one state")
    .required("Required"),
  selectedCounties: Yup.array()
    .min(1, "Select at least one county")
    .required("Required"),
  district: Yup.string().optional(),
  selectedCategories: Yup.array()
    .min(1, "Select at least one coverage type")
    .required("Required"),
  selectedProducts: Yup.array()
    .min(1, "Select at least one product")
    .required("Required"),
});

export const step2Schema = Yup.object().shape({
  streetAddress: Yup.string().required("Street address is required"),
  city: Yup.string().optional(),
  state: Yup.string().optional(),
  country: Yup.string().optional(),
  postalCode: Yup.string().optional(),
});

export const step3Schema = Yup.object().shape({
  businessName: Yup.string().required("Business name is required"),
  businessWebsite: Yup.string().url("Invalid URL").optional(),
  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Required"),
});
