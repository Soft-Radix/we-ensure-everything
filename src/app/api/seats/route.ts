import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* GET /api/seats?countyId=&categoryCode=&productCode= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countyId = searchParams.get("countyId");
  const categoryCode = searchParams.get("categoryCode");
  const productCode = searchParams.get("productCode");

  if (!countyId || !categoryCode || !productCode) {
    return NextResponse.json(
      { error: "countyId, categoryCode, productCode required" },
      { status: 400 },
    );
  }

  try {
    const [rows] = await pool.query<any[]>(
      `SELECT s.id, s.status, s.assigned_at,
              a.first_name, a.last_name, a.email AS agent_email,
              a.phone AS agent_phone, a.photo_url, a.bio,
              a.website_url, a.license_state,
              co.name AS county, co.state_abbr,
              cat.name AS category_name,
              p.name AS product_name
       FROM seats s
       JOIN agents   a   ON a.id   = s.agent_id
       JOIN counties co  ON co.id  = s.county_id
       JOIN categories cat ON cat.id = s.category_id
       JOIN products   p   ON p.id  = s.product_id
       WHERE s.county_id   = ?
         AND cat.code      = ?
         AND p.code        = ?
         AND s.status      = 'active'
       LIMIT 1`,
      [countyId, categoryCode.toUpperCase(), productCode.toUpperCase()],
    );

    if (rows.length === 0) {
      return NextResponse.json({ available: true, seat: null });
    }

    return NextResponse.json({ available: false, seat: rows[0] });
  } catch (err) {
    console.error("[API /seats GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
