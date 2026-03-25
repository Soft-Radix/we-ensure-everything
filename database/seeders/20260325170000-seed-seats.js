"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Clear existing seats
    await queryInterface.bulkDelete("seats", null, {});

    // Helper to get IDs
    const [categories] = await queryInterface.sequelize.query(
      "SELECT id, code FROM categories",
    );
    const [products] = await queryInterface.sequelize.query(
      "SELECT id, code, category_id FROM products",
    );
    const [agents] = await queryInterface.sequelize.query(
      "SELECT id, ghl_user_id, state_abbr, county, category, product FROM agents WHERE status = 'active'",
    );
    const [counties] = await queryInterface.sequelize.query(
      "SELECT id, name, state_abbr FROM counties",
    );

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.code, c.id]),
    );
    const productMap = Object.fromEntries(
      products.map((p) => [`${p.category_id}_${p.code}`, p.id]),
    );
    const countyMap = Object.fromEntries(
      counties.map((c) => [`${c.state_abbr}_${c.name.toLowerCase()}`, c.id]),
    );

    const seatsToInsert = [];

    for (const agent of agents) {
      const catId = categoryMap[agent.category];
      const prodId = productMap[`${catId}_${agent.product}`];
      const countyKey = `${agent.state_abbr}_${agent.county.toLowerCase()}`;
      const countyId = countyMap[countyKey];

      if (catId && prodId && countyId) {
        seatsToInsert.push({
          county_id: countyId,
          category_id: catId,
          product_id: prodId,
          agent_id: agent.id,
          status: "active",
          assigned_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    // Also add a few more seats for the demo agents in their specified counties
    // to ensure they are "exclusive" for those products
    if (seatsToInsert.length > 0) {
      await queryInterface.bulkInsert("seats", seatsToInsert, {
        ignoreDuplicates: true,
      });
    }

    // Re-enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("seats", null, {});
  },
};
