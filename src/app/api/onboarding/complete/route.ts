import { NextRequest, NextResponse } from "next/server";
import { Seat, Product, County, Agent, Waitlist, sequelize } from "@/models";
import { PlanType } from "@/lib/enum";
import { Op } from "sequelize";

export async function POST(req: NextRequest) {
  const t = await sequelize.transaction();
  try {
    const {
      email,
      selectedStates,
      selectedCounties,
      selectedCategories,
      selectedProducts,
    } = await req.json();

    const agent = await Agent.findOne({ where: { email }, transaction: t });
    if (!agent || !agent.plan_type) {
      if (t) await t.rollback();
      return NextResponse.json(
        { error: "Agent not eligible for onboarding" },
        { status: 400 },
      );
    }

    const planType = agent.plan_type;
    const results: any[] = [];

    // Identify all (County, Category, Product) triplets that need to be processed
    const targets: {
      countyId: number;
      categoryId: number;
      productId: number;
    }[] = [];

    const categoryIds =
      selectedCategories?.map((id: string) => parseInt(id)) || [];
    const productIds =
      selectedProducts?.map((id: string) => parseInt(id)) || [];
    const countyIds = selectedCounties?.map((id: string) => parseInt(id)) || [];

    if (planType === PlanType.REFFERAL_PRO) {
      for (const coId of countyIds) {
        for (const catId of categoryIds) {
          for (const prodId of productIds) {
            targets.push({
              countyId: coId,
              categoryId: catId,
              productId: prodId,
            });
          }
        }
      }
    } else if (planType === PlanType.AGENT_PRO) {
      const products = await Product.findAll({
        where: { category_id: { [Op.in]: categoryIds } },
        transaction: t,
      });

      for (const coId of countyIds) {
        for (const p of products) {
          targets.push({
            countyId: coId,
            categoryId: p.category_id,
            productId: p.id,
          });
        }
      }
    } else if (planType === PlanType.AGENT_PRO_PLUS) {
      const counties = await County.findAll({
        where: { state_abbr: { [Op.in]: selectedStates } },
        transaction: t,
      });
      const products = await Product.findAll({
        where: { category_id: { [Op.in]: categoryIds } },
        transaction: t,
      });

      for (const c of counties) {
        for (const p of products) {
          targets.push({
            countyId: c.id,
            categoryId: p.category_id,
            productId: p.id,
          });
        }
      }
    }

    for (const target of targets) {
      const existingSeat = await Seat.findOne({
        where: {
          county_id: target.countyId,
          category_id: target.categoryId,
          product_id: target.productId,
          status: "active",
        },
        transaction: t,
      });

      if (!existingSeat) {
        await Seat.create(
          {
            county_id: target.countyId,
            category_id: target.categoryId,
            product_id: target.productId,
            agent_id: agent.id,
            status: "active",
            assigned_at: new Date(),
          },
          { transaction: t },
        );
        results.push({ ...target, status: "assigned" });
      } else if (existingSeat.agent_id === agent.id) {
        results.push({ ...target, status: "already_assigned" });
      } else {
        const maxPos =
          ((await Waitlist.max("position", {
            where: {
              county_id: target.countyId,
              category_id: target.categoryId,
              product_id: target.productId,
              status: "waiting",
            },
            transaction: t,
          })) as number) || 0;

        await Waitlist.create(
          {
            county_id: target.countyId,
            category_id: target.categoryId,
            product_id: target.productId,
            agent_id: agent.id,
            position: maxPos + 1,
            status: "waiting",
          },
          { transaction: t },
        );
        results.push({ ...target, status: "waitlisted" });
      }
    }

    await t.commit();
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    if (t) await t.rollback();
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
