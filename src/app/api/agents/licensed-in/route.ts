import { NextRequest, NextResponse } from "next/server";
import { sequelize, Agent, Category, Product, Licensed } from "@/models";
import { Op } from "sequelize";
import {
  subAccountAdminEndpoint,
  subAccountURL,
  subAccountVersion,
} from "@/lib/data/static";
import { sendGHLWebhook } from "@/lib/ghl-webhook";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      selectedCounties,
      selectedCategory,
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
      // Create Sub Account
      const createSubAccount = async () => {
        const ghlWebhookUrl = subAccountURL;
        if (!ghlWebhookUrl) return null;

        const payload: any = {
          name: fullName,
          email: email || null,
          phone: phone || null,
          companyId: process.env.GHL_COMPANY_ID,
          address: streetAddress,
          snapshotId: process.env.GHL_SNAPSHOT_ID,
        };

        try {
          const res = await fetch(ghlWebhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.GHL_AGENT_SUBACCOUNT_TOKEN}`,
              version: subAccountVersion,
            },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            throw new Error(
              `Sub account creation failed with status: ${res.status}`,
            );
          }
          const subAccountData = await res.json();

          console.log(
            "✅ GHL Sub Account triggered successfully!",
            subAccountData,
          );
          const locationId = subAccountData?.id ?? subAccountData?.locationId;
          if (locationId) {
            await agent.update({ ghl_location_id: locationId });
          }
          if (!locationId) {
            throw new Error(
              "❌ No location ID returned from sub account creation",
            );
          }
          const nameParts = fullName.trim().split(" ").filter(Boolean);
          const firstName = nameParts[0] || "";
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;
          const userRes = await fetch(subAccountAdminEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GHL_AGENT_SUBACCOUNT_TOKEN}`,
              Version: subAccountVersion,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email: email,
              password: "StrongPassword@123",
              type: "account",
              role: "admin",
              companyId: process.env.GHL_COMPANY_ID,
              locationIds: [locationId],
            }),
          });
          if (!userRes.ok) {
            const errorBody = await userRes.json().catch(() => userRes.text());
            console.error(
              "❌ GHL User creation error body:",
              JSON.stringify(errorBody, null, 2),
            );
            throw new Error(
              `User creation failed with status: ${userRes.status}`,
            );
          }

          const userData = await userRes.json();
          console.log("✅ GHL User created successfully!", userData);

          return { subAccountData, userData };
        } catch (err) {
          console.error("❌ GHL Sub Account failed:", err);
          return null;
        }
      };

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

      // 2. Fetch products
      let products: Product[] = [];
      if (selectedProducts && selectedProducts.length > 0) {
        // Fetch specific products
        products = await Product.findAll({
          where: { code: selectedProducts },
          include: [{ model: Category, attributes: ["id", "code"] }],
          transaction: t,
        });
      } else if (selectedCategory) {
        // Fetch all products for the single selected category
        const category = await Category.findOne({
          where: { code: selectedCategory },
          transaction: t,
        });
        if (category) {
          products = await Product.findAll({
            where: { category_id: category.id },
            include: [{ model: Category, attributes: ["id", "code"] }],
            transaction: t,
          });
        }
      }

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
      // Trigger GHL Webhook with Agent
      await sendGHLWebhook("agent_created", {
        name: fullName,
        email: email || null,
        phone: phone || null,
        state: state,
        county: selectedCounties,
        category: selectedCategory,
      });
      // Trigger GHL Sub Account
      const subAccount = await createSubAccount();
      const locationId = subAccount?.id || subAccount?.locationId;

      return NextResponse.json({
        success: true,
        agentId: agent.id,
        locationId: locationId || null,
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
