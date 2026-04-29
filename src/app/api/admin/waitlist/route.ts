import { NextRequest, NextResponse } from "next/server";
import { Waitlist, Agent, County, Category, Product } from "@/models";

/* GET /api/admin/waitlist - Fetch all waitlist entries with filters */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateAbbr = searchParams.get("state");
    const countyId = searchParams.get("countyId");
    const categoryId = searchParams.get("categoryId");

    const whereClause: any = { status: "waiting" };
    if (countyId) whereClause.county_id = countyId;
    if (categoryId) whereClause.category_id = categoryId;

    const countyWhere: any = {};
    if (stateAbbr) countyWhere.state_abbr = stateAbbr;

    const waitlist = await Waitlist.findAll({
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
        ["created_at", "ASC"],
      ],
    });

    return NextResponse.json({ waitlist });
  } catch (err) {
    console.error("[API /admin/waitlist GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
