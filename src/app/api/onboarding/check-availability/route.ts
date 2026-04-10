import { NextRequest, NextResponse } from "next/server";
import { Seat, County } from "@/models";
import { PlanType } from "@/lib/enum";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  try {
    const {
      planType,
      selectedStates,
      selectedCounties,
      selectedCategories,
      selectedProducts,
    } = await req.json();

    if (!planType) {
      return NextResponse.json(
        { error: "Plan type is required" },
        { status: 400 },
      );
    }

    let isAvailable = true;
    let message = "Available";

    const catIds = selectedCategories?.map((id: string) => parseInt(id)) || [];
    const coIds = selectedCounties?.map((id: string) => parseInt(id)) || [];
    const prodIds = selectedProducts?.map((id: string) => parseInt(id)) || [];
    const stAbbrs = selectedStates || [];

    if (planType === PlanType.REFFERAL_PRO) {
      if (coIds.length === 0 || catIds.length === 0 || prodIds.length === 0) {
        return NextResponse.json({ success: true, isAvailable: true });
      }

      const count = await Seat.count({
        where: {
          county_id: { [Op.in]: coIds },
          category_id: { [Op.in]: catIds },
          product_id: { [Op.in]: prodIds },
          status: "active",
        },
      });

      if (count > 0) {
        isAvailable = false;
        message = `${count} selected seat(s) are already occupied and will be added to the waitlist.`;
      }
    } else if (planType === PlanType.AGENT_PRO) {
      if (coIds.length === 0 || catIds.length === 0) {
        return NextResponse.json({ success: true, isAvailable: true });
      }

      const count = await Seat.count({
        where: {
          county_id: { [Op.in]: coIds },
          category_id: { [Op.in]: catIds },
          status: "active",
        },
      });

      if (count > 0) {
        isAvailable = false;
        message = `Some products in your selected territories are already occupied. You will be waitlisted for those specific spots.`;
      }
    } else if (planType === PlanType.AGENT_PRO_PLUS) {
      if (stAbbrs.length === 0 || catIds.length === 0) {
        return NextResponse.json({ success: true, isAvailable: true });
      }

      const counties = await County.findAll({
        where: { state_abbr: { [Op.in]: stAbbrs } },
      });
      const queryCountyIds = counties.map((c) => c.id);

      if (queryCountyIds.length > 0) {
        const count = await Seat.count({
          where: {
            county_id: { [Op.in]: queryCountyIds },
            category_id: { [Op.in]: catIds },
            status: "active",
          },
        });

        if (count > 0) {
          isAvailable = false;
          message = `Some spots in your selected states are already occupied. You will be waitlisted for those specific areas.`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      isAvailable,
      message,
    });
  } catch (error: any) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
