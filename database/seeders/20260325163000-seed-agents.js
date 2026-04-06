"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Clear existing agents
    await queryInterface.bulkDelete("agents", null, {});

    // NOTE: state_abbr, county, category, product are removed by migration
    // 20260401122631-remove-denormalized-fields-from-agents.js
    // Agents are now linked to seats for coverage data.
    const agents = [
      {
        ghl_user_id: "ghl_001",
        full_name: "Brandon Elliott",
        email: "brandon@insureboost.com",
        phone: "3214503600",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_002",
        full_name: "Corey Jermaine Jackson",
        email: "coreyjackson12@gmail.com",
        phone: "8133594949",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_003",
        full_name: "Cynthia Rodriguez",
        email: "cynthia.rodriguez@simplifiedhealthcaresolution.com",
        phone: "2158691422",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_004",
        full_name: "Greg Roe",
        email: "greg@roeins.com",
        phone: "8132638715",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_005",
        full_name: "James Sebest",
        email: "james@john-galt.com",
        phone: "9542143751",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_006",
        full_name: "Joseph Menachem",
        email: "joseph@markerinsurance.com",
        phone: "9544567505",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_007",
        full_name: "Ken Tolchin",
        email: "ken@practicalinsurancesolutions.com",
        phone: "5612128092",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_008",
        full_name: "Paul Vawrock",
        email: "paul@vawrock.com",
        phone: "8139291150",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_009",
        full_name: "saurabhinfinite",
        email: "sb@infiniteinsuranceusa.com",
        phone: "9549870100",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_010",
        full_name: "Shamir Montealegre",
        email: "info@helloinsuranceagents.com",
        phone: "9546620662",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_011",
        full_name: "Brandon Rapose",
        email: "coveragewithbrandon@gmail.com",
        phone: "4842744257",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_012",
        full_name: "Mikell Simmons",
        email: "mike@weinsureeverything.com",
        phone: "9544054015",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_013",
        full_name: "Kenneth Bryant",
        email: "kenneth.bryant@kbagencygroup.com",
        phone: "4077150906",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_014",
        full_name: "Rosalyn Jones",
        email: "rosalyn@rljones.com",
        phone: "3526423274",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_015",
        full_name: "Alex Brito",
        email: "alex@singlepointes.com",
        phone: "7862500016",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_016",
        full_name: "Imtiyaz Mavani",
        email: "infinityinsurance2@gmail.com",
        phone: "14692269495",
        status: "inactive",
      },
      {
        ghl_user_id: "ghl_017",
        full_name: "Cat Simmons",
        email: "mikesimmons01@gmail.com",
        phone: "19544054015",
        status: "active",
      },
      {
        ghl_user_id: "ghl_018",
        full_name: "John Adams",
        email: "jadams@test.com",
        phone: "13055555555",
        status: "active",
      },
      {
        ghl_user_id: "ghl_019",
        full_name: "Kamal Jones",
        email: "kjones@test.com",
        phone: "19545555555",
        status: "active",
      },
    ];

    await queryInterface.bulkInsert(
      "agents",
      agents.map((a) => ({
        ...a,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      { ignoreDuplicates: true },
    );

    // Re-enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("agents", null, {});
  },
};
