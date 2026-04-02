import { NextResponse } from "next/server";
import { Lead, Agent, Seat, Waitlist } from "@/models";

export async function GET() {
  try {
    const [leadsCount, agentsCount, activeSeats, waitlistCount] =
      await Promise.all([
        Lead.count(),
        Agent.count(),
        Seat.count({ where: { status: "active" } }),
        Waitlist.count({ where: { status: "waiting" } }),
      ]);

    return NextResponse.json({
      leadsCount,
      agentsCount,
      activeSeats,
      waitlistCount,
      revenueEstimated: activeSeats * 950, // Mock business logic
      growthRate: "+12.5%",
    });
  } catch (err) {
    console.error("[API /admin/stats GET] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
