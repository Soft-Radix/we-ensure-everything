import { NextRequest, NextResponse } from "next/server";
import { sequelize, Agent, Category, Product, Seat, Waitlist } from "@/models";

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
      // 1. Upsert agent
      const [agent] = await Agent.upsert(
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

      const seatResults = [];

      // 3. For each county and each product, create a seat or add to waitlist
      for (const countyId of selectedCounties) {
        for (const product of products) {
          const categoryId = product.category_id;
          const productId = product.id;

          // Check if seat is available
          const existingSeat = await Seat.findOne({
            where: {
              county_id: countyId,
              category_id: categoryId,
              product_id: productId,
              status: "active",
            },
            transaction: t,
          });

          if (!existingSeat) {
            // Assign seat
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
            seatResults.push({ countyId, productId, status: "assigned" });
          } else if (existingSeat.agent_id === agent.id) {
            // Already has it
            seatResults.push({
              countyId,
              productId,
              status: "already_assigned",
            });
          } else {
            // Occupied -> Waitlist
            const maxPosition = await Waitlist.max<number, Waitlist>(
              "position",
              {
                where: {
                  county_id: countyId,
                  category_id: categoryId,
                  product_id: productId,
                  status: "waiting",
                },
                transaction: t,
              },
            );

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
            seatResults.push({
              countyId,
              productId,
              status: "waitlisted",
              position: nextPosition,
            });
          }
        }
      }

      await t.commit();

      return NextResponse.json({
        success: true,
        agentId: agent.id,
        seatResults,
      });
    } catch (err: unknown) {
      await t.rollback();
      throw err;
    }
  } catch (error: unknown) {
    console.error("[API /agents/onboard] Onboarding error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to onboard agent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
