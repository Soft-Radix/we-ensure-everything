import { NextRequest, NextResponse } from "next/server";
import { Agent } from "@/models";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const agent = await Agent.findOne({ where: { email } });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found. Please register and pay first." },
        { status: 404 },
      );
    }

    if (!agent.plan_type) {
      return NextResponse.json(
        { error: "Plan type not set. Please complete your payment." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        fullName: agent.full_name,
        email: agent.email,
        planType: agent.plan_type,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
