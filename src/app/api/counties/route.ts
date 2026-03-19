import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const state = searchParams.get("state") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  try {
    const params: (string | number)[] = [];
    let sql = `SELECT id, fips_code, name, state, state_abbr FROM counties WHERE 1=1`;

    if (q) {
      sql += ` AND name LIKE ?`;
      params.push(`%${q}%`);
    }
    if (state) {
      sql += ` AND state_abbr = ?`;
      params.push(state.toUpperCase());
    }
    sql += ` ORDER BY state_abbr, name LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.query(sql, params);
    return NextResponse.json({ counties: rows });
  } catch (err) {
    console.error("[API /counties] DB error:", err);
    return NextResponse.json(
      { error: "Failed to fetch counties" },
      { status: 500 },
    );
  }
}
