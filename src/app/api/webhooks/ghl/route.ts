import { NextRequest, NextResponse } from "next/server";
import Agent from "@/models/Agent";
import Payment from "@/models/Payment";
import WebhookLog from "@/models/WebhookLog";
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

    // Create initial log entry
    const logEntry = await WebhookLog.create({
      source: "ghl",
      event_type: body.type || "unknown",
      payload: body,
      status: "received",
    });

    const { agent_email, plan_type, ghl_payment_id, amount, currency } = body;

    if (!agent_email) {
      await logEntry.update({
        status: "ignored",
        error_message: "Agent email is required",
      });
      return NextResponse.json(
        { error: "Agent email is required" },
        { status: 400 },
      );
    }

    // Find the agent by email
    const agent = await Agent.findOne({ where: { email: agent_email } });

    if (!agent) {
      await logEntry.update({
        status: "ignored",
        error_message: `Agent with email ${agent_email} not found`,
      });
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
      await logEntry.update({
        status: "ignored",
        error_message: "Invalid plan type received",
      });
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

    await logEntry.update({ status: "processed" });

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

    // If we have a body, we can try to log the failure
    // (In a real scenario, you'd want to handle the case where logEntry isn't created yet)
    await WebhookLog.create({
      source: "ghl",
      event_type: "error",
      payload: {},
      status: "failed",
      error_message: message,
    });

    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 },
    );
  }
}
