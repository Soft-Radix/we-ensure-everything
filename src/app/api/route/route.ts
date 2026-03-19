import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { randomUUID } from "crypto";

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
  } = body;

  // ── 1. Input validation ──────────────────────────────────────
  if (!countyId || !categoryCode || !productCode) {
    return NextResponse.json(
      { error: "countyId, categoryCode, and productCode are required" },
      { status: 400 },
    );
  }

  const conn = await pool.getConnection();

  try {
    // ── 2. Idempotency check (no reassignment within 24 hours for same email+product) ──
    if (email) {
      const [recent] = await conn.query<any[]>(
        `SELECT id, routing_status, assigned_agent_id FROM leads
         WHERE email = ? AND product_id = (
           SELECT p.id FROM products p
           JOIN categories c ON c.id = p.category_id
           WHERE c.code = ? AND p.code = ?
           LIMIT 1
         )
         AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
         LIMIT 1`,
        [email, categoryCode.toUpperCase(), productCode.toUpperCase()],
      );
      if (recent.length > 0) {
        return NextResponse.json(
          {
            status: "duplicate",
            message:
              "A routing request was already submitted in the last 24 hours.",
            leadId: recent[0].id,
          },
          { status: 200 },
        );
      }
    }

    // ── 3. Resolve category & product IDs ────────────────────────
    const [catRows] = await conn.query<any[]>(
      `SELECT c.id AS categoryId, p.id AS productId
       FROM categories c
       JOIN products p ON p.category_id = c.id
       WHERE c.code = ? AND p.code = ? AND c.active = 1 AND p.active = 1
       LIMIT 1`,
      [categoryCode.toUpperCase(), productCode.toUpperCase()],
    );

    if (catRows.length === 0) {
      return NextResponse.json(
        { error: "Invalid category or product code" },
        { status: 400 },
      );
    }
    const { categoryId, productId } = catRows[0];

    // ── 4. Validate county ───────────────────────────────────────
    const [countyRows] = await conn.query<any[]>(
      `SELECT id FROM counties WHERE id = ? LIMIT 1`,
      [countyId],
    );
    if (countyRows.length === 0) {
      return NextResponse.json({ error: "Invalid county ID" }, { status: 400 });
    }

    // ── 5. Look up exclusive seat ────────────────────────────────
    const [seatRows] = await conn.query<any[]>(
      `SELECT s.id AS seatId, a.id AS agentId,
              a.first_name, a.last_name, a.email AS agentEmail,
              a.phone AS agentPhone, a.photo_url, a.bio,
              a.website_url, a.ghl_user_id, a.license_state
       FROM seats s
       JOIN agents a ON a.id = s.agent_id
       WHERE s.county_id = ? AND s.category_id = ? AND s.product_id = ?
         AND s.status = 'active' AND a.status = 'active'
       LIMIT 1`,
      [countyId, categoryId, productId],
    );

    const leadId = randomUUID();
    const latencyMs = Date.now() - startTime;

    // ── 6a. AGENT FOUND → assign ─────────────────────────────────
    if (seatRows.length > 0) {
      const agent = seatRows[0];

      await conn.query(
        `INSERT INTO leads (id, county_id, category_id, product_id,
           first_name, last_name, email, phone,
           assigned_agent_id, routing_status, source, routed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'assigned', ?, NOW())`,
        [
          leadId,
          countyId,
          categoryId,
          productId,
          firstName || null,
          lastName || null,
          email || null,
          phone || null,
          agent.agentId,
          source,
        ],
      );

      await conn.query(
        `INSERT INTO routing_logs (lead_id, event, payload, status, latency_ms)
         VALUES (?, 'ROUTED_TO_AGENT', ?, 'success', ?)`,
        [
          leadId,
          JSON.stringify({
            agentId: agent.agentId,
            countyId,
            categoryId,
            productId,
          }),
          latencyMs,
        ],
      );

      return NextResponse.json({
        status: "assigned",
        leadId,
        agent: {
          id: agent.agentId,
          firstName: agent.first_name,
          lastName: agent.last_name,
          email: agent.agentEmail,
          phone: agent.agentPhone,
          photoUrl: agent.photo_url,
          bio: agent.bio,
          websiteUrl: agent.website_url,
          licenseState: agent.license_state,
        },
        message: "An exclusive agent has been found for your area.",
      });
    }

    // ── 6b. NO AGENT → log and return no-agent state ─────────────
    await conn.query(
      `INSERT INTO leads (id, county_id, category_id, product_id,
         first_name, last_name, email, phone,
         routing_status, source, routed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'no_agent', ?, NOW())`,
      [
        leadId,
        countyId,
        categoryId,
        productId,
        firstName || null,
        lastName || null,
        email || null,
        phone || null,
        source,
      ],
    );

    await conn.query(
      `INSERT INTO routing_logs (lead_id, event, payload, status, latency_ms)
       VALUES (?, 'NO_AGENT_FOUND', ?, 'success', ?)`,
      [leadId, JSON.stringify({ countyId, categoryId, productId }), latencyMs],
    );

    return NextResponse.json({
      status: "no_agent",
      leadId,
      message:
        "No exclusive agent is currently available in your area for this coverage. Our team will follow up with you shortly.",
    });
  } catch (err) {
    console.error("[API /route] Error:", err);

    await conn
      .query(
        `INSERT INTO routing_logs (lead_id, event, payload, status, error_msg, latency_ms)
       VALUES (?, 'ROUTING_ERROR', ?, 'failure', ?, ?)`,
        [
          randomUUID(),
          JSON.stringify({ countyId, categoryCode, productCode }),
          String(err),
          Date.now() - startTime,
        ],
      )
      .catch(() => {});

    return NextResponse.json(
      { error: "Internal routing error. Please try again." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
