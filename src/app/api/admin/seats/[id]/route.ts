import { NextRequest, NextResponse } from "next/server";
import { Seat } from "@/models";

/* DELETE /api/admin/seats/[id] - Remove (deactivate) a seat */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const seat = await Seat.findByPk(id);
    if (!seat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    }

    // Bulk deactivate all products for this agent in this category ACROSS ALL COUNTIES
    await Seat.update(
      { status: "inactive" },
      {
        where: {
          agent_id: seat.agent_id,
          category_id: seat.category_id,
          status: "active",
        },
      },
    );

    return NextResponse.json({
      message: "Category seats removed successfully",
    });
  } catch (err) {
    console.error("[API /admin/seats DELETE]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
