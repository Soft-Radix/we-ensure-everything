import { NextRequest, NextResponse } from "next/server";
import {
  sequelize,
  Agent,
  Category,
  Product,
  County,
  Seat,
  Waitlist,
} from "@/models";

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
    fullName?: string;
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
    stateAbbr?: string;
    countyName?: string;
    categoryName?: string;
    productName?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    ghlUserId,
    fullName,
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
    stateAbbr,
    countyName,
    categoryName,
    productName,
  } = body;

  if (
    (!fullName && (!firstName || !lastName)) ||
    !email ||
    !countyId ||
    !categoryCode ||
    !productCode
  ) {
    return NextResponse.json(
      {
        error:
          "fullName (or firstName and lastName), email, countyId, categoryCode, productCode are required",
      },
      { status: 400 },
    );
  }

  const t = await sequelize.transaction();

  try {
    const finalFullName =
      fullName || `${firstName || ""} ${lastName || ""}`.trim();

    if (!finalFullName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // 1. Resolve records
    const countyRecord = await County.findByPk(countyId, { transaction: t });
    const productRecord = await Product.findOne({
      where: { code: productCode.toUpperCase() },
      include: [
        {
          model: Category,
          where: { code: categoryCode.toUpperCase() },
          required: true,
        },
      ],
      transaction: t,
    });

    if (!countyRecord || !productRecord) {
      await t.rollback();
      return NextResponse.json(
        { error: "Invalid county, category or product" },
        { status: 400 },
      );
    }

    const { category_id: categoryId, id: productId } = productRecord;
    const resolvedStateAbbr = stateAbbr || countyRecord.state_abbr;
    const resolvedCounty = countyName || countyRecord.name;
    const resolvedCategory = categoryName || productRecord.Category!.name;
    const resolvedProduct = productName || productRecord.name;

    // 2. Upsert agent with detailed fields
    const [agent] = await Agent.upsert(
      {
        ghl_user_id: ghlUserId || null,
        full_name: finalFullName,
        email,
        phone: phone || "",
        state_abbr: resolvedStateAbbr,
        county: resolvedCounty,
        category: resolvedCategory,
        product: resolvedProduct,
        license_no: licenseNo || null,
        license_state: licenseState || null,
        bio: bio || null,
        photo_url: photoUrl || null,
        status: "active",
      },
      { transaction: t },
    );

    // 3. Check if seat is available
    const existingSeat = await Seat.findOne({
      where: {
        county_id: countyId,
        category_id: categoryId,
        product_id: productId,
        status: "active",
      },
      transaction: t,
    });

    let result: { status: string; message: string };

    if (!existingSeat) {
      // Seat is free → assign
      await Seat.create(
        {
          county_id: countyId,
          category_id: categoryId,
          product_id: productId,
          agent_id: agent.id,
          status: "active",
        },
        { transaction: t },
      );
      result = {
        status: "assigned",
        message: "Agent assigned to seat successfully.",
      };
    } else {
      // Seat occupied → waitlist
      const maxPosition = await Waitlist.max<number, Waitlist>("position", {
        where: {
          county_id: countyId,
          category_id: categoryId,
          product_id: productId,
          status: "waiting",
        },
        transaction: t,
      });

      const nextPosition = (maxPosition || 0) + 1;

      await Waitlist.upsert(
        {
          county_id: countyId,
          category_id: categoryId,
          product_id: productId,
          agent_id: agent.id,
          position: nextPosition,
          status: "waiting",
        },
        { transaction: t },
      );

      result = {
        status: "waitlisted",
        message: `Seat is occupied. Agent added to waitlist at position ${nextPosition}.`,
      };
    }

    await t.commit();
    return NextResponse.json({ ...result, agentId: agent.id });
  } catch (err) {
    if (t) await t.rollback();
    console.error("[API /agents POST] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* GET /api/agents - list agents with seat counts */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Agent.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      // We can also include seats to get counts, but for simplicity:
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM seats AS s
              WHERE s.agent_id = Agent.id AND s.status = 'active'
            )`),
            "seat_count",
          ],
        ],
      },
    });

    return NextResponse.json({
      agents: rows,
      total: count,
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
