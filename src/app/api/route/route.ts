import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Op } from "sequelize";
import {
  Lead,
  RoutingLog,
  Category,
  Product,
  County,
  Seat,
  Agent,
} from "@/models";

/* ──────────────────────────────────────────────────────────────
   POST /api/route
   Body: { countyId, categoryCode, productCode, firstName,
           lastName, email, phone, source? }
   Returns: { status, agent?, leadId, message }
────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  let body: {
    countyId?: number;
    categoryCode?: string;
    productCode?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    source?: string;
    referredBy?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    countyId,
    categoryCode,
    productCode,
    firstName,
    lastName,
    email,
    phone,
    source = "website",
    referredBy,
  } = body;

  // ── 1. Input validation ──────────────────────────────────────
  if (!countyId || !categoryCode || !productCode) {
    return NextResponse.json(
      { error: "countyId, categoryCode, and productCode are required" },
      { status: 400 },
    );
  }

  try {
    // ── 2. Resolve category & product ──────────────────────────
    const product = await Product.findOne({
      where: {
        code: productCode.toUpperCase(),
        active: true,
      },
      include: [
        {
          model: Category,
          where: {
            code: categoryCode.toUpperCase(),
            active: true,
          },
        },
      ],
    });

    if (!product || !product.Category) {
      return NextResponse.json(
        { error: "Invalid category or product code" },
        { status: 400 },
      );
    }

    const { id: productId, name: productName } = product;
    const { id: categoryId, name: categoryName } = product.Category;

    // ── 3. Idempotency check ───────────────────────────────────
    if (email) {
      const recent = await Lead.findOne({
        where: {
          email,
          product_id: productId,
          created_at: {
            [Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });

      if (recent) {
        return NextResponse.json(
          {
            status: "duplicate",
            message:
              "A routing request was already submitted in the last 24 hours.",
            leadId: recent.id,
          },
          { status: 200 },
        );
      }
    }

    // ── 4. Validate county ─────────────────────────────────────
    const county = await County.findByPk(countyId);
    if (!county) {
      return NextResponse.json({ error: "Invalid county ID" }, { status: 400 });
    }
    const fullCountyDisplay = `${county.name} (${county.state_abbr})`;

    // ── 5. Look up exclusive seat ─────────────────────────────
    const seat = await Seat.findOne({
      where: {
        county_id: countyId,
        category_id: categoryId,
        product_id: productId,
        status: "active",
      },
      include: [
        {
          model: Agent,
          where: { status: "active" },
        },
      ],
    });

    const leadId = randomUUID();
    const latencyMs = Date.now() - startTime;

    // Helper for GHL Webhook
    const sendToGHL = async (agentInfo: Agent | null = null) => {
      const ghlWebhookUrl = process.env.GHL_WEBHOOK;
      if (!ghlWebhookUrl) return;

      const payload: any = {
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        email: email || null,
        phone: phone || null,
        county: fullCountyDisplay,
        category: categoryName,
        product: productName,
        referred_by: referredBy || null,
      };

      if (agentInfo) {
        payload.agent = {
          name: agentInfo.full_name,
          email: agentInfo.email,
          phone: agentInfo.phone,
        };
      }

      try {
        await fetch(ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("✅ GHL Webhook triggered successfully!", payload);
      } catch (err) {
        console.error("❌ GHL Webhook failed:", err);
      }
    };

    // ── 6a. AGENT FOUND → assign ───────────────────────────────
    if (seat && (seat as any).Agent) {
      const agent = (seat as any).Agent as Agent;

      await Lead.create({
        id: leadId,
        county_id: countyId,
        category_id: categoryId,
        product_id: productId,
        first_name: firstName || null,
        last_name: lastName || null,
        email: email || null,
        phone: phone || null,
        assigned_agent_id: agent.id,
        routing_status: "assigned",
        source,
        referred_by_agent_id: referredBy || null,
        routed_at: new Date(),
      });

      await RoutingLog.create({
        lead_id: leadId,
        event: "ROUTED_TO_AGENT",
        payload: {
          agentId: agent.id,
          countyId,
          categoryId,
          productId,
        },
        status: "success",
        latency_ms: latencyMs,
      });

      // Trigger GHL Webhook with Agent
      await sendToGHL(agent);

      return NextResponse.json({
        status: "assigned",
        leadId,
        agent: {
          id: agent.id,
          fullName: agent.full_name,
          email: agent.email,
          phone: agent.phone,
          photoUrl: agent.photo_url,
          bio: agent.bio,
          websiteUrl: agent.website_url,
          licenseState: agent.license_state,
        },
        message: "An exclusive agent has been found for your area.",
      });
    }

    // ── 6b. NO AGENT → log and return no-agent state ───────────
    await Lead.create({
      id: leadId,
      county_id: countyId,
      category_id: categoryId,
      product_id: productId,
      first_name: firstName || null,
      last_name: lastName || null,
      email: email || null,
      phone: phone || null,
      routing_status: "no_agent",
      source,
      referred_by_agent_id: referredBy || null,
      routed_at: new Date(),
    });

    await RoutingLog.create({
      lead_id: leadId,
      event: "NO_AGENT_FOUND",
      payload: { countyId, categoryId, productId },
      status: "success",
      latency_ms: latencyMs,
    });

    // Trigger GHL Webhook without Agent
    await sendToGHL();

    return NextResponse.json({
      status: "no_agent",
      leadId,
      message:
        "No exclusive agent is currently available in your area for this coverage. Our team will follow up with you shortly.",
    });
  } catch (err: any) {
    console.error("[API /route] Error:", err);

    try {
      await RoutingLog.create({
        lead_id: randomUUID(),
        event: "ROUTING_ERROR",
        payload: { countyId, categoryCode, productCode },
        status: "failure",
        error_msg: String(err),
        latency_ms: Date.now() - startTime,
      });
    } catch (logErr) {
      console.error("Failed to log error to routing_logs:", logErr);
    }

    return NextResponse.json(
      { error: "Internal routing error. Please try again." },
      { status: 500 },
    );
  }
}
