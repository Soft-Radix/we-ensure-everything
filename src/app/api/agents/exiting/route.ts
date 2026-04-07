import { NextRequest, NextResponse } from "next/server";
import { Agent } from "@/models";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone } = body;

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and phone are required." },
        { status: 400 },
      );
    }

    try {
      // Check if agent already exists with the same email or phone
      const existingAgent = await Agent.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (existingAgent) {
        const field = existingAgent.email === email ? "email" : "phone number";
        return NextResponse.json(
          { error: `An agent with this ${field} already exists.` },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
      });
    } catch (err: unknown) {
      throw err;
    }
  } catch (error: unknown) {
    console.error("[API /agents/exiting] Fetching error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
