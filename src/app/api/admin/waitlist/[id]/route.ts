import { NextRequest, NextResponse } from "next/server";
import { Waitlist } from "@/models";

/* DELETE /api/admin/waitlist/[id] - Remove (cancel) a waitlist entry */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const entry = await Waitlist.findByPk(id);
    if (!entry) {
      return NextResponse.json(
        { error: "Waitlist entry not found" },
        { status: 404 },
      );
    }

    entry.status = "cancelled";
    await entry.save();

    return NextResponse.json({
      message: "Waitlist entry removed successfully",
    });
  } catch (err) {
    console.error("[API /admin/waitlist DELETE]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
