import { NextRequest, NextResponse } from "next/server";
import { Seat, Agent, County, Category, Product } from "@/models";
import { PlanType } from "@/lib/enum";

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
    const seat = await Seat.findOne({
      where: { county_id: Number(countyId), status: "active" },
      include: [
        {
          model: Agent,
          attributes: [
            "id",
            "full_name",
            "email",
            "phone",
            "photo_url",
            "bio",
            "website_url",
            "license_state",
          ],
          where: { status: "active" },
          required: true,
        },
        {
          model: County,
          attributes: ["name", "state_abbr"],
          required: true,
        },
        {
          model: Category,
          attributes: ["name"],
          where: { code: categoryCode.toUpperCase() },
          required: true,
        },
        {
          model: Product,
          attributes: ["name"],
          where: { code: productCode.toUpperCase() },
          required: true,
        },
      ],
    });

    if (!seat) {
      return NextResponse.json({ available: true, seat: null });
    }

    return NextResponse.json({ available: false, seat });
  } catch (err) {
    console.error("[API /seats GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* POST /api/seats - Manually assign a seat (or all seats in a category) to an agent */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, countyId, categoryId, productId } = body;

    if (!agentId || !countyId || !categoryId) {
      return NextResponse.json(
        { error: "agentId, countyId, and categoryId are required" },
        { status: 400 },
      );
    }

    // Check if the agent exists
    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check if the agent has the correct plan
    if (agent.plan_type !== PlanType.AGENT_PRO) {
      return NextResponse.json(
        {
          error:
            "Agent must have the AgentPro plan to be assigned seats manually.",
        },
        { status: 400 },
      );
    }

    // Assign all products in the category (Force Assign)
    const products = await Product.findAll({
      where: { category_id: categoryId, active: true },
    });

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No active products found for this category" },
        { status: 400 },
      );
    }

    const results = {
      assigned: 0,
      alreadyHeld: 0,
      conflicts: [] as any[],
      errors: [] as string[],
    };

    // 1. First, check for ALL conflicts in the category
    for (const prod of products) {
      const existingSeat = await Seat.findOne({
        where: {
          county_id: countyId,
          product_id: prod.id,
          status: "active",
        },
        include: [
          {
            model: Agent,
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      });

      if (existingSeat) {
        if (existingSeat.agent_id !== Number(agentId)) {
          results.conflicts.push({
            product: prod.name,
            agent: existingSeat.Agent,
          });
        }
      }
    }

    // 2. If there are any conflicts, return them and STOP
    if (results.conflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Conflicts detected. Some seats are already occupied.",
          conflicts: results.conflicts,
        },
        { status: 400 },
      );
    }

    // 3. If no conflicts, proceed with assignment
    for (const prod of products) {
      try {
        const existingSeat = await Seat.findOne({
          where: {
            county_id: countyId,
            product_id: prod.id,
            status: "active",
            agent_id: Number(agentId),
          },
        });

        if (existingSeat) {
          results.alreadyHeld++;
          continue;
        }

        await Seat.create({
          agent_id: Number(agentId),
          county_id: Number(countyId),
          category_id: Number(categoryId),
          product_id: prod.id,
          status: "active",
          assigned_at: new Date(),
        });
        results.assigned++;
      } catch (err: any) {
        results.errors.push(`Product ${prod.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `Successfully assigned ${results.assigned} product seats.`,
      results,
    });
  } catch (err) {
    console.error("[API /seats POST]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
