import { NextRequest, NextResponse } from "next/server";
import Agent from "@/models/Agent";
import Payment from "@/models/Payment";
import { PlanType } from "@/lib/enum";

export async function POST(req: NextRequest) {
  try {
    // Validate shared webhook secret
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("GHL Webhook received:", body);

    const { agent_email, plan_type, ghl_payment_id, amount, currency } = body;

    if (!agent_email) {
      return NextResponse.json(
        { error: "Agent email is required" },
        { status: 400 },
      );
    }

    // Find the agent by email
    const agent = await Agent.findOne({ where: { email: agent_email } });

    if (!agent) {
      return NextResponse.json(
        { error: `Agent with email ${agent_email} not found` },
        { status: 404 },
      );
    }

    // Map plan_type if necessary
    let translatedPlan: PlanType | null = null;

    // Simple mapping logic - adjust based on GHL payload
    const planStr = String(plan_type).toLowerCase();
    if (planStr.includes("referral") || planStr.includes("refferal")) {
      translatedPlan = PlanType.REFFERAL_PRO;
    } else if (planStr.includes("plus")) {
      translatedPlan = PlanType.AGENT_PRO_PLUS;
    } else if (planStr.includes("agent")) {
      translatedPlan = PlanType.AGENT_PRO;
    }

    if (!translatedPlan) {
      return NextResponse.json(
        { error: "Invalid plan type received" },
        { status: 400 },
      );
    }

    // Update agent plan and status
    await agent.update({
      plan_type: translatedPlan,
      status: "active", // Activate the agent on successful payment
    });

    // Store the payment record
    await Payment.create({
      agent_id: agent.id,
      ghl_payment_id: ghl_payment_id || null,
      amount: amount ? parseFloat(amount) : null,
      currency: currency || "USD",
      plan_type: translatedPlan,
      status: "success",
      payload: body,
    });

    return NextResponse.json({
      message: "Agent plan updated and payment stored successfully",
      agent: {
        email: agent.email,
        plan_type: agent.plan_type,
      },
    });
  } catch (error: unknown) {
    console.error("GHL Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 },
    );
  }
}
