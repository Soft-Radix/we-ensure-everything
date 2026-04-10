"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 1. Clear existing data
    await queryInterface.bulkDelete("seats", null, {});
    await queryInterface.bulkDelete("waitlist", null, {});
    await queryInterface.bulkDelete("agents", null, {});

    // 2. Define the new list of agents (Profile only)
    const agentProfiles = [
      {
        full_name: "Corey Jermaine Jackson",
        email: "coreyjackson12@gmail.com",
        phone: "8133594949",
      },
      {
        full_name: "Cynthia Rodriguez",
        email: "cynthia.rodriguez@simplifiedhealthcaresolution.com",
        phone: "2158691422",
      },
      { full_name: "Greg Roe", email: "greg@roeins.com", phone: "8132638715" },
      {
        full_name: "Joseph Menachem",
        email: "joseph@markerinsurance.com",
        phone: "954567505",
      },
      {
        full_name: "Ken Tolchin",
        email: "ken@practicalinsurancesolutions.com",
        phone: "5612128092",
      },
      {
        full_name: "Paul Wavrock",
        email: "paul@wavrock.com",
        phone: "8139291150",
      },
      {
        full_name: "Saurabh Bhatt",
        email: "sb@infiniteinsuranceusa.com",
        phone: "9549870100",
      },
      {
        full_name: "Shamir Montealegre",
        email: "info@helloinsuranceagents.com",
        phone: "9546620662",
      },
      {
        full_name: "Brandon Rapose",
        email: "coveragewithbrandon@gmail.com",
        phone: "4842744257",
      },
      {
        full_name: "Mikell Simmons",
        email: "mike@weinsureeverything.com",
        phone: "9544054015",
      },
      {
        full_name: "Kenneth Bryant",
        email: "kenneth.bryant@kbagencygroup.com",
        phone: "4077150906",
      },
      {
        full_name: "Rosalyn Jones",
        email: "rosalyn@rljones.com",
        phone: "3526423274",
      },
      {
        full_name: "Alex Brito",
        email: "alex@singlepointes.com",
        phone: "7862500016",
      },
    ];

    await queryInterface.bulkInsert(
      "agents",
      agentProfiles.map((a) => ({
        ...a,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      })),
    );

    // Get all agents back with IDs
    const [agents] = await queryInterface.sequelize.query(
      "SELECT id, email FROM agents",
    );
    const agentMap = Object.fromEntries(agents.map((a) => [a.email, a.id]));

    // 3. Define their licenses/seats
    const agentLicenses = [
      {
        email: "coreyjackson12@gmail.com",
        state: "FL",
        county: "Hillsborough",
        cat: "LIFE_DISABILITY",
        prod: "INDIV_LIFE",
      },
      {
        email: "cynthia.rodriguez@simplifiedhealthcaresolution.com",
        state: "FL",
        county: "Orange",
        cat: "HEALTH",
        prod: "MEDICARE",
      }, // Orlando -> Orange
      {
        email: "greg@roeins.com",
        state: "FL",
        county: "Pasco",
        cat: "BUSINESS_COMMERCIAL",
        prod: "GEN_LIABILITY",
      },
      {
        email: "joseph@markerinsurance.com",
        state: "FL",
        county: "Broward",
        cat: "BUSINESS_COMMERCIAL",
        prod: "OCEAN_MARINE",
      },
      {
        email: "ken@practicalinsurancesolutions.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "LIFE_DISABILITY",
        prod: "ANNUITIES",
      },
      {
        email: "paul@wavrock.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "HEALTH",
        prod: "GROUP_HEALTH",
      },
      {
        email: "sb@infiniteinsuranceusa.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "AUTO_VEHICLE",
        prod: "AUTO",
      },
      {
        email: "info@helloinsuranceagents.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "AUTO_VEHICLE",
        prod: "AUTO",
      },
      {
        email: "coveragewithbrandon@gmail.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "HEALTH",
        prod: "GROUP_HEALTH",
      },
      {
        email: "mike@weinsureeverything.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "HEALTH",
        prod: "GROUP_HEALTH",
      },
      {
        email: "kenneth.bryant@kbagencygroup.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "LIFE_DISABILITY",
        prod: "INDIV_LIFE",
      },
      {
        email: "rosalyn@rljones.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "HEALTH",
        prod: "MEDICARE",
      },
      {
        email: "alex@singlepointes.com",
        state: "FL",
        county: "Miami-Dade",
        cat: "HEALTH",
        prod: "GROUP_VOLUNTARY",
      },
    ];

    // Helper maps for resolution
    const [categories] = await queryInterface.sequelize.query(
      "SELECT id, code FROM categories",
    );
    const [products] = await queryInterface.sequelize.query(
      "SELECT id, code, category_id FROM products",
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

    const occupiedSeats = new Set();
    const seatsToInsert = [];
    const waitlistToInsert = [];

    for (const lic of agentLicenses) {
      const agentId = agentMap[lic.email];
      const catId = categoryMap[lic.cat];
      const prodId = productMap[`${catId}_${lic.prod}`];
      const countyKey = `${lic.state}_${lic.county.toLowerCase()}`;
      const countyId = countyMap[countyKey];

      if (!agentId || !catId || !prodId || !countyId) {
        console.warn(
          `Could not resolve data for ${lic.email}: agentId=${agentId}, catId=${catId}, prodId=${prodId}, countyId=${countyId}`,
        );
        continue;
      }

      const seatKey = `${countyId}_${catId}_${prodId}`;

      if (!occupiedSeats.has(seatKey)) {
        // Assign to active seat
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
        occupiedSeats.add(seatKey);
      } else {
        // Seat taken -> Waitlist
        // Find existing position count
        const currentWaiters = waitlistToInsert.filter(
          (w) =>
            w.county_id === countyId &&
            w.category_id === catId &&
            w.product_id === prodId,
        ).length;

        waitlistToInsert.push({
          county_id: countyId,
          category_id: catId,
          product_id: prodId,
          agent_id: agentId,
          position: currentWaiters + 1,
          status: "waiting",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    if (seatsToInsert.length > 0) {
      await queryInterface.bulkInsert("seats", seatsToInsert);
    }
    if (waitlistToInsert.length > 0) {
      await queryInterface.bulkInsert("waitlist", waitlistToInsert);
    }

    // Re-enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("seats", null, {});
    await queryInterface.bulkDelete("waitlist", null, {});
    await queryInterface.bulkDelete("agents", null, {});
  },
};
