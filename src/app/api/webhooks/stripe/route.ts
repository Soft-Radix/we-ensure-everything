import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Agent from "@/models/Agent";
import Payment from "@/models/Payment";
import WebhookLog from "@/models/WebhookLog";
import { PlanType } from "@/lib/enum";

// ⚠️ Must use raw body — NOT req.json()
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const rawBody = await req.text(); // <-- raw, not parsed
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  // Stripe verifies the payload using your webhook signing secret
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!, // from Stripe Dashboard
    );
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    // Log failed signature attempts for security monitoring
    await WebhookLog.create({
      source: "stripe",
      event_type: "signature_failed",
      payload: { signature: sig },
      status: "failed",
      error_message: err instanceof Error ? err.message : "Invalid signature",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Create log entry for the received event
  const logEntry = await WebhookLog.create({
    source: "stripe",
    event_type: event.type,
    payload: event,
    status: "received",
  });

  try {
    // Stripe sends typed events, not custom fields
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const agentEmail = session.customer_email;
        if (!agentEmail) {
          await logEntry.update({
            status: "ignored",
            error_message: "No customer email in session",
          });
          break;
        }

        const agent = await Agent.findOne({ where: { email: agentEmail } });
        if (!agent) {
          await logEntry.update({
            status: "ignored",
            error_message: `Agent with email ${agentEmail} not found`,
          });
          break;
        }

        await agent.update({ plan_type: PlanType.AGENT_PRO, status: "active" });

        await Payment.create({
          agent_id: agent.id,
          ghl_payment_id: session.payment_intent as string,
          amount: session.amount_total ? session.amount_total / 100 : null,
          currency: session.currency?.toUpperCase() ?? "USD",
          plan_type: PlanType.AGENT_PRO,
          status: "success",
          payload: JSON.parse(JSON.stringify(event)),
        });

        await logEntry.update({ status: "processed" });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const agentEmail = invoice.customer_email;
        console.warn(`Payment failed for: ${agentEmail}`);
        // optionally update agent status to "inactive" or "payment_failed"
        await logEntry.update({ status: "processed" });
        break;
      }

      // Handle other events as needed
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
        await logEntry.update({ status: "ignored" });
    }
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    await logEntry.update({
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Must return 200 quickly — Stripe retries if you don't
  return NextResponse.json({ received: true });
}
