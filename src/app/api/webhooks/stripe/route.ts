// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Agent from "@/models/Agent";
import Payment from "@/models/Payment";
import { PlanType } from "@/lib/enum";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ⚠️ Must use raw body — NOT req.json()
export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Stripe sends typed events, not custom fields
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // You pass your own data via metadata when creating the session
      const agentEmail = session.metadata?.agent_email;
      const planType = session.metadata?.plan_type;

      if (!agentEmail || !planType) break;

      const agent = await Agent.findOne({ where: { email: agentEmail } });
      if (!agent) break;

      const translatedPlan = mapPlanType(planType);
      if (!translatedPlan) break;

      await agent.update({ plan_type: translatedPlan, status: "active" });

      await Payment.create({
        agent_id: agent.id,
        ghl_payment_id: session.id, // Stripe session ID
        amount: session.amount_total ? session.amount_total / 100 : null, // Stripe uses cents
        currency: session.currency?.toUpperCase() ?? "USD",
        plan_type: translatedPlan,
        status: "success",
        payload: JSON.parse(JSON.stringify(event)),
      });

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // handle failed payments...
      break;
    }

    // Handle other events as needed
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  // Must return 200 quickly — Stripe retries if you don't
  return NextResponse.json({ received: true });
}

function mapPlanType(planType: string): PlanType | null {
  const p = planType.toLowerCase();
  if (p.includes("referral") || p.includes("refferal"))
    return PlanType.REFFERAL_PRO;
  if (p.includes("plus")) return PlanType.AGENT_PRO_PLUS;
  if (p.includes("agent")) return PlanType.AGENT_PRO;
  return null;
}
