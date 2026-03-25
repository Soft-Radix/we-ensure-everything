import { NextResponse } from "next/server";
import { State } from "@/models";

export async function GET() {
  try {
    const states = await State.findAll({
      where: { active: true },
      attributes: ["id", "code", "name"],
      order: [["name", "ASC"]],
    });

    return NextResponse.json({ states });
  } catch (err) {
    console.error("[API /states] DB error:", err);
    return NextResponse.json(
      { error: "Failed to fetch states" },
      { status: 500 },
    );
  }
}
