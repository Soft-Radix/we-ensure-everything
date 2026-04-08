import { NextRequest, NextResponse } from "next/server";
import { sequelize, Agent, Category, Product, Licensed } from "@/models";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      selectedCounties,
      district,
      selectedProducts,
      streetAddress,
      city,
      state,
      country,
      postalCode,
      businessName,
      businessWebsite,
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Full name, email, and phone are required" },
        { status: 400 },
      );
    }

    const t = await sequelize.transaction();

    try {
      // Check if agent already exists with the same email or phone
      const existingAgent = await Agent.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
        transaction: t,
      });

      if (existingAgent) {
        await t.rollback();
        const field = existingAgent.email === email ? "email" : "phone number";
        return NextResponse.json(
          { error: `An agent with this ${field} already exists.` },
          { status: 400 },
        );
      }

      // 1. Create agent
      const agent = await Agent.create(
        {
          full_name: fullName,
          email,
          phone,
          business_name: businessName || null,
          business_website: businessWebsite || null,
          street_address: streetAddress || null,
          city: city || null,
          state: state || null,
          country: country || null,
          postal_code: postalCode || null,
          district: district || null,
          status: "active",
        },
        { transaction: t },
      );

      // 2. Fetch all selected products to get their category IDs
      const products = await Product.findAll({
        where: { code: selectedProducts },
        include: [{ model: Category, attributes: ["id", "code"] }],
        transaction: t,
      });

      // 3. For each county and each product, record in licensed_in table
      const licensedRecords = [];
      for (const countyId of selectedCounties) {
        for (const product of products) {
          licensedRecords.push({
            county_id: countyId,
            category_id: product.category_id,
            product_id: product.id,
            agent_id: agent.id,
            status: "active" as "active" | "inactive",
          });
        }
      }

      if (licensedRecords.length > 0) {
        await Licensed.bulkCreate(licensedRecords, { transaction: t });
      }

      await t.commit();

      return NextResponse.json({
        success: true,
        agentId: agent.id,
        message: "Agent licensing information recorded successfully",
      });
    } catch (err: unknown) {
      await t.rollback();
      throw err;
    }
  } catch (error: unknown) {
    console.error("[API /agents/licensed-in] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
