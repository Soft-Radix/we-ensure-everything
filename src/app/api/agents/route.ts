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
   Body: { ghlUserId, fullName, email, phone,state_abbr,county,
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
    bio?: string;
    photoUrl?: string;
    // Legacy single license fields
    countyId?: number;
    categoryCode?: string;
    productCode?: string;
    // Multi-license support
    licenses?: Array<{
      countyId: number;
      categoryCode: string;
      productCode: string;
    }>;
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
    bio,
    photoUrl,
    countyId,
    categoryCode,
    productCode,
    licenses,
  } = body;

  // Normalizing licenses into an array
  const finalLicenses = [...(licenses || [])];
  if (countyId && categoryCode && productCode) {
    // Check if it's already in the array to avoid duplicates
    const exists = finalLicenses.find(
      (l) =>
        l.countyId === countyId &&
        l.categoryCode === categoryCode &&
        l.productCode === productCode,
    );
    if (!exists) {
      finalLicenses.push({ countyId, categoryCode, productCode });
    }
  }

  if ((!fullName && (!firstName || !lastName)) || !email) {
    return NextResponse.json(
      { error: "fullName (or firstName and lastName) and email are required" },
      { status: 400 },
    );
  }

  const t = await sequelize.transaction();

  try {
    const finalFullName =
      fullName || `${firstName || ""} ${lastName || ""}`.trim();

    // 1. Upsert agent (profile only)
    const [agent] = await Agent.upsert(
      {
        ghl_user_id: ghlUserId || null,
        full_name: finalFullName,
        email,
        phone: phone || "",
        license_no: licenseNo || null,
        license_state: licenseState || null,
        bio: bio || null,
        photo_url: photoUrl || null,
        status: "active",
      },
      { transaction: t },
    );

    const routingResults = [];

    // 2. Process each license
    for (const lic of finalLicenses) {
      const {
        countyId: licCountyId,
        categoryCode: licCatCode,
        productCode: licProdCode,
      } = lic;

      const countyRecord = await County.findByPk(licCountyId, {
        transaction: t,
      });
      const productRecord = await Product.findOne({
        where: { code: licProdCode.toUpperCase() },
        include: [
          {
            model: Category,
            where: { code: licCatCode.toUpperCase() },
            required: true,
          },
        ],
        transaction: t,
      });

      if (!countyRecord || !productRecord) {
        routingResults.push({
          license: lic,
          status: "error",
          message: "Invalid county, category or product",
        });
        continue;
      }

      const { category_id: categoryId, id: productId } = productRecord;

      // 3. Check if seat is available
      const existingSeat = await Seat.findOne({
        where: {
          county_id: licCountyId,
          category_id: categoryId,
          product_id: productId,
          status: "active",
        },
        transaction: t,
      });

      if (!existingSeat) {
        // Seat is free → assign
        await Seat.create(
          {
            county_id: licCountyId,
            category_id: categoryId,
            product_id: productId,
            agent_id: agent.id,
            status: "active",
          },
          { transaction: t },
        );
        routingResults.push({
          license: lic,
          status: "assigned",
          message: "Agent assigned to seat successfully.",
        });
      } else if (existingSeat.agent_id === agent.id) {
        // Already assigned to this agent
        routingResults.push({
          license: lic,
          status: "assigned",
          message: "Agent already holds this seat.",
        });
      } else {
        // Seat occupied → waitlist
        const maxPosition = await Waitlist.max<number, Waitlist>("position", {
          where: {
            county_id: licCountyId,
            category_id: categoryId,
            product_id: productId,
            status: "waiting",
          },
          transaction: t,
        });

        const nextPosition = (maxPosition || 0) + 1;

        await Waitlist.upsert(
          {
            county_id: licCountyId,
            category_id: categoryId,
            product_id: productId,
            agent_id: agent.id,
            position: nextPosition,
            status: "waiting",
          },
          { transaction: t },
        );

        routingResults.push({
          license: lic,
          status: "waitlisted",
          message: `Seat is occupied. Agent added to waitlist at position ${nextPosition}.`,
        });
      }
    }

    await t.commit();
    return NextResponse.json({
      agentId: agent.id,
      results: routingResults,
    });
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
