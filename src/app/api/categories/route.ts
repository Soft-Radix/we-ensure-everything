import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/data/categories";

export async function GET() {
  const categories = CATEGORIES.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    icon: c.icon,
    description: c.description,
    productCount: c.products.length,
  }));

  return NextResponse.json({ categories });
}
