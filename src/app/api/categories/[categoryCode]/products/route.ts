import { NextRequest, NextResponse } from "next/server";
import { Category, Product } from "@/models";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryCode: string }> },
) {
  const { categoryCode } = await params;

  try {
    const category = await Category.findOne({
      where: { code: categoryCode.toUpperCase(), active: true },
      attributes: ["id", "code", "name"],
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const products = await Product.findAll({
      where: { category_id: category.id, active: true },
      attributes: ["id", "code", "name", "description", "sort_order"],
      order: [["sort_order", "ASC"]],
    });

    return NextResponse.json({
      products,
      category: { code: category.code, name: category.name },
    });
  } catch (err) {
    console.error("[API /categories/[categoryCode]/products] DB error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
