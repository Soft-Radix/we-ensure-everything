import { NextRequest, NextResponse } from "next/server";
import { Seat } from "@/models";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  try {
    const {
      selectedStates,
      selectedCounties,
      selectedCategories,
    } = await req.json();

    let isAvailable = true;
    let message = "Available";

    const catIds = selectedCategories?.map((id: string) => parseInt(id)) || [];
    const coIds = selectedCounties?.map((id: string) => parseInt(id)) || [];

    // Basic validation: if no counties or categories are selected, we assume it's available 
    // (though the frontend should prevent this).
    if (coIds.length === 0 || catIds.length === 0) {
      return NextResponse.json({
        success: true,
        isAvailable: true,
        message: "Available",
      });
    }

    // Unified logic: Check if any active seats exist for the selected counties and categories.
    // In the new single-plan model, an active seat in a county for a category makes that territory occupied.
    const count = await Seat.count({
      where: {
        county_id: { [Op.in]: coIds },
        category_id: { [Op.in]: catIds },
        status: "active",
      },
    });

    if (count > 0) {
      isAvailable = false;
      message = `The selected territory for your chosen coverage is currently occupied. You will be added to the waitlist.`;
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

