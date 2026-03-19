import { NextRequest, NextResponse } from "next/server";
import { getCategoryByCode } from "@/lib/data/categories";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryCode: string }> },
) {
  const { categoryCode } = await params;
  const category = getCategoryByCode(categoryCode.toUpperCase());

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({
    products: category.products,
    category: { code: category.code, name: category.name },
  });
}
