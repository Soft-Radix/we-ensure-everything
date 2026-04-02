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
      "SELECT id, email FROM agents WHERE status = 'active'",
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
    const agentMap = Object.fromEntries(agents.map((a) => [a.email, a.id]));

    const demoAssignments = [
      // Sarah Miller - Auto & Home in multiple counties
      {
        email: "sarah@agentpro-demo.com",
        state: "CA",
        county: "Los Angeles",
        cat: "AUTO_VEHICLE",
        prod: "AUTO",
      },
      {
        email: "sarah@agentpro-demo.com",
        state: "CA",
        county: "Orange",
        cat: "AUTO_VEHICLE",
        prod: "AUTO",
      },
      {
        email: "sarah@agentpro-demo.com",
        state: "CA",
        county: "Los Angeles",
        cat: "PROPERTY_CASUALTY",
        prod: "HOME",
      },
      // John Thompson - Health in multiple states (if county data exists)
      {
        email: "john@agentpro-demo.com",
        state: "TX",
        county: "Dallas",
        cat: "HEALTH",
        prod: "MEDICARE",
      },
      {
        email: "john@agentpro-demo.com",
        state: "TX",
        county: "Tarrant",
        cat: "HEALTH",
        prod: "MEDICARE",
      },
      // Elena Rodriguez - Niche & Health
      {
        email: "elena@agentpro-demo.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "HEALTH",
        prod: "GROUP_HEALTH",
      },
      {
        email: "elena@agentpro-demo.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "NICHE_SPECIALTY",
        prod: "TRAVEL",
      },
      // Cat Simmons (Active one)
      {
        email: "mikesimmons01@gmail.com",
        state: "AR",
        county: "Pulaski",
        cat: "BUSINESS_COMMERCIAL",
        prod: "BUILDERS_RISK",
      },
    ];

    const seatsToInsert = [];

    for (const assign of demoAssignments) {
      const agentId = agentMap[assign.email];
      const catId = categoryMap[assign.cat];
      const prodId = productMap[`${catId}_${assign.prod}`];
      const countyKey = `${assign.state}_${assign.county.toLowerCase()}`;
      const countyId = countyMap[countyKey];

      if (agentId && catId && prodId && countyId) {
        seatsToInsert.push({
          county_id: countyId,
          category_id: catId,
          product_id: prodId,
          agent_id: agentId,
          status: "active",
          assigned_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

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
