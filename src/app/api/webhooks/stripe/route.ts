import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  Agent,
  Payment,
  WebhookLog,
  Seat,
  Waitlist,
  Licensed,
  sequelize,
} from "@/models";
import { PlanType } from "@/lib/enum";
import { sendGHLWebhook } from "@/lib/ghl-webhook";
import {
  subAccountAdminEndpoint,
  subAccountURL,
  subAccountVersion,
} from "@/lib/data/static";

async function createGHLSubAccount(agent: any) {
  const ghlWebhookUrl = subAccountURL;
  if (!ghlWebhookUrl) return null;

  const payload: any = {
    name: agent.full_name,
    email: agent.email || null,
    phone: agent.phone || null,
    companyId: process.env.GHL_COMPANY_ID,
    address: agent.street_address,
    snapshotId: process.env.GHL_SNAPSHOT_ID,
  };

  try {
    const res = await fetch(ghlWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GHL_AGENT_SUBACCOUNT_TOKEN}`,
        version: subAccountVersion,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Sub account creation failed with status: ${res.status}`);
    }
    const subAccountData = await res.json();

    console.log("✅ GHL Sub Account triggered successfully!", subAccountData);
    const locationId = subAccountData?.id ?? subAccountData?.locationId;
    if (locationId) {
      await agent.update({ ghl_location_id: locationId });
    } else {
      throw new Error("❌ No location ID returned from sub account creation");
    }

    const nameParts = agent.full_name.trim().split(" ").filter(Boolean);
    const firstName = nameParts[0] || "";
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

    const userRes = await fetch(subAccountAdminEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHL_AGENT_SUBACCOUNT_TOKEN}`,
        Version: subAccountVersion,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email: agent.email,
        password: "StrongPassword@123",
        type: "account",
        role: "admin",
        companyId: process.env.GHL_COMPANY_ID,
        locationIds: [locationId],
      }),
    });

    if (!userRes.ok) {
      const errorBody = await userRes.json().catch(() => userRes.text());
      console.error(
        "❌ GHL User creation error body:",
        JSON.stringify(errorBody, null, 2),
      );
      throw new Error(`User creation failed with status: ${userRes.status}`);
    }

    const userData = await userRes.json();
    console.log("✅ GHL User created successfully!", userData);

    return { subAccountData, userData };
  } catch (err) {
    console.error("❌ GHL Sub Account failed:", err);
    return null;
  }
}

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
      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge;

        let agentEmail: string | null = null;

        if (charge.billing_details?.email) {
          agentEmail = charge.billing_details.email;
        } else if (charge.receipt_email) {
          agentEmail = charge.receipt_email;
        } else if (charge.customer) {
          const customer = await stripe.customers.retrieve(
            charge.customer as string,
          );
          if (customer && !customer.deleted) {
            agentEmail = (customer as Stripe.Customer).email;
          }
        }

        if (!agentEmail) {
          await logEntry.update({
            status: "ignored",
            error_message: "No email found",
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

        const planType =
          (charge.metadata?.plan_type as PlanType) || PlanType.AGENT_PRO;

        const t = await sequelize.transaction();
        try {
          await agent.update(
            { plan_type: planType, status: "active" },
            { transaction: t },
          );

          // Send GHL Webhook
          await sendGHLWebhook("paid", {
            name: agent.full_name,
            email: agent.email,
            phone: agent.phone,
            state: agent.state,
          });

          await Payment.create(
            {
              agent_id: agent.id,
              ghl_payment_id: charge.payment_intent as string,
              amount: charge.amount ? charge.amount / 100 : null,
              currency: charge.currency?.toUpperCase() ?? "USD",
              plan_type: planType,
              status: "success",
              payload: JSON.parse(JSON.stringify(event)),
            },
            { transaction: t },
          );

          // Assign seats based on Licensed territories
          const licensedTerritories = await Licensed.findAll({
            where: { agent_id: agent.id },
            transaction: t,
          });

          for (const territory of licensedTerritories) {
            const existingSeat = await Seat.findOne({
              where: {
                county_id: territory.county_id,
                category_id: territory.category_id,
                product_id: territory.product_id,
                status: "active",
              },
              transaction: t,
            });

            if (!existingSeat) {
              await Seat.create(
                {
                  county_id: territory.county_id,
                  category_id: territory.category_id,
                  product_id: territory.product_id,
                  agent_id: agent.id,
                  status: "active",
                  assigned_at: new Date(),
                },
                { transaction: t },
              );
              // Send GHL Webhook
              await sendGHLWebhook("onboarded", {
                name: agent.full_name,
                email: agent.email,
                phone: agent.phone,
                state: agent.state,
              });
            } else if (existingSeat.agent_id !== agent.id) {
              // Add to waitlist if seat is taken by someone else
              const maxPos =
                ((await Waitlist.max("position", {
                  where: {
                    county_id: territory.county_id,
                    category_id: territory.category_id,
                    product_id: territory.product_id,
                    status: "waiting",
                  },
                  transaction: t,
                })) as number) || 0;

              await Waitlist.create(
                {
                  county_id: territory.county_id,
                  category_id: territory.category_id,
                  product_id: territory.product_id,
                  agent_id: agent.id,
                  position: maxPos + 1,
                  status: "waiting",
                },
                { transaction: t },
              );
              // Send GHL Webhook
              await sendGHLWebhook("scheduled", {
                name: agent.full_name,
                email: agent.email,
                phone: agent.phone,
                state: agent.state,
              });
            }
          }

          await t.commit();
          await logEntry.update({ status: "processed" });

          // Create GHL Sub Account after successful payment and transaction commit
          try {
            await createGHLSubAccount(agent);
          } catch (ghlError) {
            console.error("Error creating GHL sub-account:", ghlError);
            // We don't want to fail the whole webhook if GHL sub-account fails, 
            // but we should log it.
          }
        } catch (error) {
          await t.rollback();
          throw error;
        }
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
