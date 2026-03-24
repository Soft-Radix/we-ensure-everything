import { NextResponse } from "next/server";
import { Category, Product } from "@/models";

export async function GET() {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      attributes: ["id", "code", "name", "icon", "description", "sort_order"],
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "code", "name"],
          where: { active: true },
          required: false,
        },
      ],
      order: [["sort_order", "ASC"]],
    });

    const result = categories.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      icon: c.icon,
      description: c.description,
      // @ts-expect-error - products association loaded via include
      productCount: c.products?.length ?? 0,
    }));

    return NextResponse.json({ categories: result });
  } catch (err) {
    console.error("[API /categories] DB error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
