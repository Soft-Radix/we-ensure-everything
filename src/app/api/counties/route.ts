import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { County } from "@/models";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const state = searchParams.get("state") || searchParams.get("states") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 3000);

  try {
    const where: Record<string, unknown> = {};

    if (q) {
      where.name = { [Op.like]: `%${q}%` };
    }
    if (state) {
      const states = state.split(",").map((s) => s.trim().toUpperCase());
      if (states.length > 1) {
        where.state_abbr = { [Op.in]: states };
      } else {
        where.state_abbr = states[0];
      }
    }

    const counties = await County.findAll({
      where,
      attributes: ["id", "name", "state", "state_abbr"],
      order: [
        ["state_abbr", "ASC"],
        ["name", "ASC"],
      ],
      limit,
    });

    return NextResponse.json({ counties });
  } catch (err) {
    console.error("[API /counties] DB error:", err);
    return NextResponse.json(
      { error: "Failed to fetch counties" },
      { status: 500 },
    );
  }
}
