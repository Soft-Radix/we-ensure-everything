"use client";
import dynamic from "next/dynamic";

// Lazy-load Toaster — client-only, never needed for first paint
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => ({ default: mod.Toaster })),
  { ssr: false }
);

export default function ToasterProvider() {
  return <Toaster position="top-right" />;
}
