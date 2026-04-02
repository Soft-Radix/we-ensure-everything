import Sidebar from "@/components/admin/Sidebar";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/admin/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-h-screen bg-slate-50 font-sans ${inter.variable} ${playfair.variable}`}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 transition-opacity animate-in fade-in duration-700 h-screen overflow-y-auto">
        <Header />

        <section className="p-8 pb-32">{children}</section>
      </main>
    </div>
  );
}
