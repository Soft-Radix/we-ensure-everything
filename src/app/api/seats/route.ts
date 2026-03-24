import { NextRequest, NextResponse } from "next/server";
import { Seat, Agent, County, Category, Product } from "@/models";

/* GET /api/seats?countyId=&categoryCode=&productCode= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countyId = searchParams.get("countyId");
  const categoryCode = searchParams.get("categoryCode");
  const productCode = searchParams.get("productCode");

  if (!countyId || !categoryCode || !productCode) {
    return NextResponse.json(
      { error: "countyId, categoryCode, productCode required" },
      { status: 400 },
    );
  }

  try {
    const seat = await Seat.findOne({
      where: { county_id: Number(countyId), status: "active" },
      include: [
        {
          model: Agent,
          attributes: [
            "id",
            "full_name",
            "email",
            "phone",
            "photo_url",
            "bio",
            "website_url",
            "license_state",
          ],
          where: { status: "active" },
          required: true,
        },
        {
          model: County,
          attributes: ["name", "state_abbr"],
          required: true,
        },
        {
          model: Category,
          attributes: ["name"],
          where: { code: categoryCode.toUpperCase() },
          required: true,
        },
        {
          model: Product,
          attributes: ["name"],
          where: { code: productCode.toUpperCase() },
          required: true,
        },
      ],
    });

    if (!seat) {
      return NextResponse.json({ available: true, seat: null });
    }

    return NextResponse.json({ available: false, seat });
  } catch (err) {
    console.error("[API /seats GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
