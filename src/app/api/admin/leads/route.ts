import { NextRequest, NextResponse } from "next/server";
import { Lead, County, Category, Product, Agent } from "@/models";
import { Op } from "sequelize";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;
  const search = searchParams.get("search") || "";

  try {
    const { count, rows } = await Lead.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      where: search
        ? {
            [Op.or]: [
              { first_name: { [Op.like]: `%${search}%` } },
              { last_name: { [Op.like]: `%${search}%` } },
            ],
          }
        : undefined,

      include: [
        { model: County, attributes: ["name", "state_abbr"] },
        { model: Category, attributes: ["name"] },
        { model: Product, attributes: ["name"] },
        { model: Agent, attributes: ["full_name"] },
      ],
    });

    return NextResponse.json({
      leads: rows,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    console.error("[API /admin/leads GET] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
