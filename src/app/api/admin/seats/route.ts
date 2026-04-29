import { NextRequest, NextResponse } from "next/server";
import { Seat, Agent, County, Category, Product, State } from "@/models";
import { Op } from "sequelize";

/* GET /api/admin/seats - Fetch all active seats with filters */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateAbbr = searchParams.get("state");
    const countyId = searchParams.get("countyId");
    const categoryId = searchParams.get("categoryId");

    const whereClause: any = { status: "active" };
    if (countyId) whereClause.county_id = countyId;
    if (categoryId) whereClause.category_id = categoryId;

    const countyWhere: any = {};
    if (stateAbbr) countyWhere.state_abbr = stateAbbr;

    const seats = await Seat.findAll({
      where: whereClause,
      include: [
        {
          model: Agent,
          attributes: ["id", "full_name", "email", "phone", "plan_type"],
        },
        {
          model: County,
          attributes: ["id", "name", "state_abbr"],
          where: Object.keys(countyWhere).length > 0 ? countyWhere : undefined,
          required: true,
        },
        {
          model: Category,
          attributes: ["id", "name", "code"],
        },
        {
          model: Product,
          attributes: ["id", "name", "code"],
        },
      ],
      order: [
        [Category, "name", "ASC"],
        [County, "name", "ASC"],
      ],
    });

    return NextResponse.json({ seats });
  } catch (err) {
    console.error("[API /admin/seats GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
