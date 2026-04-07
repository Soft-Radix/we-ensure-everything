export const categories = [
  {
    code: "AUTO_VEHICLE",
    icon: "/icons/vehicle.png",
    name: "Auto & Vehicle",
    desc: "Coverage for cars, trucks, motorcycles, and RVs",
  },
  {
    code: "PROPERTY_CASUALTY",
    icon: "/icons/property.png",
    name: "Property & Casualty",
    desc: "Homeowners, renters, and general liability coverage",
  },
  {
    code: "HEALTH",
    icon: "/icons/health.png",
    name: "Health",
    desc: "Individual and group health insurance plans",
  },
  {
    code: "LIFE_DISABILITY",
    icon: "/icons/life.png",
    name: "Life & Disability",
    desc: "Life insurance, disability, and income protection",
  },
  {
    code: "BUSINESS_COMMERCIAL",
    icon: "/icons/commercial.png",
    name: "Business & Commercial",
    desc: "BOP, general liability, and workers compensation",
  },
  {
    code: "NICHE_SPECIALTY",
    icon: "/icons/niche.png",
    name: "Niche & Specialty",
    desc: "Highly specialized and industry-specific protection",
  },
];

export const steps = [
  {
    step: "01",
    title: "Tell us what you need",
    desc: "Select your coverage type and basic requirements in seconds.",
  },
  {
    step: "02",
    title: "Get matched",
    desc: "Our system routes you to a licensed specialist for your specific area.",
  },
  {
    step: "03",
    title: "Get covered",
    desc: "Review your options with a pro and finalize your protection.",
  },
];

export const trustPoints = [
  {
    title: "Nationwide Coverage",
    desc: "Access to licensed agents in all 3,143 U.S. counties.",
    icon: "/images/worldwide.jpg",
  },
  {
    title: "Licensed Agents Only",
    desc: "We only partner with vetted, state-licensed professionals.",
    icon: "/images/licensed-insurance-agent.png",
  },
  {
    title: "Multi-Carrier Options",
    desc: "Compare policies from top carriers to find the right fit.",
    icon: "/images/multi.jpeg",
  },
  {
    title: "Secure & Instant",
    desc: "Your data is protected and matching happens in real-time.",
    icon: "/images/safe.jpg",
  },
];

export const currentStepInfo = (step: number) => {
  switch (step) {
    case 1:
      return {
        title: "Agent Credentials",
        sub: "Tell us about your licenses and expertise",
      };
    case 2:
      return {
        title: "Business Address",
        sub: "Where is your primary office located?",
      };
    case 3:
      return {
        title: "General Information",
        sub: "Finalize your professional profile",
      };
    default:
      return { title: "", sub: "" };
  }
};
export const adminRoute = "/admin";
