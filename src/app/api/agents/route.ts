import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ──────────────────────────────────────────────────────────────
   POST /api/agents
   Onboard a new agent from webhook (n8n / GoHighLevel)
   Body: { ghlUserId, firstName, lastName, email, phone,
           licenseNo, licenseState, countyId, categoryCode, productCode }
────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // Validate shared webhook secret
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    ghlUserId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    licenseNo?: string;
    licenseState?: string;
    countyId?: number;
    categoryCode?: string;
    productCode?: string;
    bio?: string;
    photoUrl?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    ghlUserId,
    firstName,
    lastName,
    email,
    phone,
    licenseNo,
    licenseState,
    countyId,
    categoryCode,
    productCode,
    bio,
    photoUrl,
  } = body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !countyId ||
    !categoryCode ||
    !productCode
  ) {
    return NextResponse.json(
      {
        error:
          "firstName, lastName, email, countyId, categoryCode, productCode are required",
      },
      { status: 400 },
    );
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Upsert agent
    await conn.query<any>(
      `INSERT INTO agents (ghl_user_id, first_name, last_name, email, phone,
         license_no, license_state, bio, photo_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
       ON DUPLICATE KEY UPDATE
         ghl_user_id = VALUES(ghl_user_id),
         first_name  = VALUES(first_name),
         last_name   = VALUES(last_name),
         phone       = VALUES(phone),
         license_no  = VALUES(license_no),
         license_state = VALUES(license_state),
         bio         = VALUES(bio),
         photo_url   = VALUES(photo_url),
         updated_at  = NOW()`,
      [
        ghlUserId || null,
        firstName,
        lastName,
        email,
        phone || null,
        licenseNo || null,
        licenseState || null,
        bio || null,
        photoUrl || null,
      ],
    );

    // Get agent ID
    const [agentRows] = await conn.query<any[]>(
      `SELECT id FROM agents WHERE email = ? LIMIT 1`,
      [email],
    );
    const agentId = agentRows[0].id;

    // 2. Resolve category & product IDs
    const [catRows] = await conn.query<any[]>(
      `SELECT c.id AS categoryId, p.id AS productId
       FROM categories c JOIN products p ON p.category_id = c.id
       WHERE c.code = ? AND p.code = ? LIMIT 1`,
      [categoryCode.toUpperCase(), productCode.toUpperCase()],
    );

    if (catRows.length === 0) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Invalid category or product" },
        { status: 400 },
      );
    }
    const { categoryId, productId } = catRows[0];

    // 3. Check if seat is available
    const [existingSeat] = await conn.query<any[]>(
      `SELECT id, agent_id FROM seats
       WHERE county_id = ? AND category_id = ? AND product_id = ? AND status = 'active'
       LIMIT 1`,
      [countyId, categoryId, productId],
    );

    let result: { status: string; message: string };

    if (existingSeat.length === 0) {
      // Seat is free → assign
      await conn.query(
        `INSERT INTO seats (county_id, category_id, product_id, agent_id, status)
         VALUES (?, ?, ?, ?, 'active')`,
        [countyId, categoryId, productId, agentId],
      );
      result = {
        status: "assigned",
        message: "Agent assigned to seat successfully.",
      };
    } else {
      // Seat occupied → waitlist
      const [wlRows] = await conn.query<any[]>(
        `SELECT MAX(position) AS maxPos FROM waitlist
         WHERE county_id = ? AND category_id = ? AND product_id = ? AND status = 'waiting'`,
        [countyId, categoryId, productId],
      );
      const nextPosition = (wlRows[0].maxPos || 0) + 1;

      await conn.query(
        `INSERT INTO waitlist (county_id, category_id, product_id, agent_id, position, status)
         VALUES (?, ?, ?, ?, ?, 'waiting')
         ON DUPLICATE KEY UPDATE position = VALUES(position), status = 'waiting'`,
        [countyId, categoryId, productId, agentId, nextPosition],
      );
      result = {
        status: "waitlisted",
        message: `Seat is occupied. Agent added to waitlist at position ${nextPosition}.`,
      };
    }

    await conn.commit();
    return NextResponse.json({ ...result, agentId });
  } catch (err) {
    await conn.rollback();
    console.error("[API /agents POST] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}

/* GET /api/agents - list agents with seat counts */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.query<any[]>(
      `SELECT a.id, a.first_name, a.last_name, a.email, a.phone,
              a.license_state, a.status, a.created_at,
              COUNT(s.id) AS seat_count
       FROM agents a
       LEFT JOIN seats s ON s.agent_id = a.id AND s.status = 'active'
       GROUP BY a.id
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    const [countRows] = await pool.query<any[]>(
      "SELECT COUNT(*) AS total FROM agents",
    );
    return NextResponse.json({
      agents: rows,
      total: countRows[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error("[API /agents GET] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
