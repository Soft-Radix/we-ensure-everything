"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // We keep existing agents and add new demo agents.
    // NOTE: state_abbr, county, category, product are removed by migration
    // 20260401122631-remove-denormalized-fields-from-agents.js
    // Agents are now linked to seats for coverage data.
    const demoAgents = [
      {
        ghl_user_id: "demo_001",
        full_name: "Sarah Miller",
        email: "sarah@agentpro-demo.com",
        phone: "123-456-7890",
        license_no: "CA-AUT-12345",
        license_state: "CA",
        bio: "Specializing in comprehensive auto coverage for families and luxury vehicles.",
        photo_url: "https://i.pravatar.cc/150?u=sarah",
        website_url: "https://agentpro.com/sarah-miller",
        status: "active",
      },
      {
        ghl_user_id: "demo_002",
        full_name: "John Thompson",
        email: "john@agentpro-demo.com",
        phone: "234-567-8901",
        license_no: "TX-PRP-98765",
        license_state: "TX",
        bio: "Helping Texans protect their biggest assets with tailored property insurance solutions.",
        photo_url: "https://i.pravatar.cc/150?u=john",
        website_url: "https://agentpro.com/john-thompson",
        status: "active",
      },
      {
        ghl_user_id: "demo_003",
        full_name: "Elena Rodriguez",
        email: "elena@agentpro-demo.com",
        phone: "345-678-9012",
        license_no: "FL-HLT-54321",
        license_state: "FL",
        bio: "Expert in group health and employee benefits for small to mid-sized businesses.",
        photo_url: "https://i.pravatar.cc/150?u=elena",
        website_url: "https://agentpro.com/elena-rodriguez",
        status: "active",
      },
      {
        ghl_user_id: "demo_004",
        full_name: "David Chen",
        email: "david@agentpro-demo.com",
        phone: "456-789-0123",
        license_no: "NY-LIF-22334",
        license_state: "NY",
        bio: "Focusing on financial peace of mind through life and disability protection strategies.",
        photo_url: "https://i.pravatar.cc/150?u=david",
        website_url: "https://agentpro.com/david-chen",
        status: "active",
      },
      {
        ghl_user_id: "demo_005",
        full_name: "Jessica White",
        email: "jessica@agentpro-demo.com",
        phone: "567-890-1234",
        license_no: "IL-BUS-11223",
        license_state: "IL",
        bio: "Providing comprehensive commercial insurance for business owners across Illinois.",
        photo_url: "https://i.pravatar.cc/150?u=jessica",
        website_url: "https://agentpro.com/jessica-white",
        status: "active",
      },
      {
        ghl_user_id: "demo_006",
        full_name: "Michael Peterson",
        email: "michael@agentpro-demo.com",
        phone: "678-901-2345",
        license_no: "GA-NCH-99887",
        license_state: "GA",
        bio: "Specialist in unique coverage types including travel, events, and specialty niche products.",
        photo_url: "https://i.pravatar.cc/150?u=michael",
        website_url: "https://agentpro.com/michael-peterson",
        status: "active",
      },
      {
        ghl_user_id: "demo_007",
        full_name: "Chloe Sullivan",
        email: "chloe@agentpro-demo.com",
        phone: "789-012-3456",
        license_no: "FL-MOT-66554",
        license_state: "FL",
        bio: "Dedicated agent for motorcycle and off-road vehicle enthusiasts in South Florida.",
        photo_url: "https://i.pravatar.cc/150?u=chloe",
        website_url: "https://agentpro.com/chloe-sullivan",
        status: "active",
      },
      {
        ghl_user_id: "demo_008",
        full_name: "Robert Moore",
        email: "robert@agentpro-demo.com",
        phone: "890-123-4567",
        license_no: "TX-FLD-44332",
        license_state: "TX",
        bio: "Expert in flood and disaster protection for high-risk property zones.",
        photo_url: "https://i.pravatar.cc/150?u=robert",
        website_url: "https://agentpro.com/robert-moore",
        status: "active",
      },
      {
        ghl_user_id: "demo_009",
        full_name: "Sophia Brown",
        email: "sophia@agentpro-demo.com",
        phone: "901-234-5678",
        license_no: "WA-MED-88776",
        license_state: "WA",
        bio: "Guiding seniors through Medicare supplement and advantage plans with clarity and care.",
        photo_url: "https://i.pravatar.cc/150?u=sophia",
        website_url: "https://agentpro.com/sophia-brown",
        status: "active",
      },
      {
        ghl_user_id: "demo_010",
        full_name: "Justin Wu",
        email: "justin@agentpro-demo.com",
        phone: "012-345-6789",
        license_no: "OH-CYB-11122",
        license_state: "OH",
        bio: "Modern agent specializing in cyber liability and digital risk management for tech business.",
        photo_url: "https://i.pravatar.cc/150?u=justin",
        website_url: "https://agentpro.com/justin-wu",
        status: "active",
      },
    ];

    await queryInterface.bulkInsert(
      "agents",
      demoAgents.map((a) => ({
        ...a,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    );

    // Re-enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "agents",
      {
        ghl_user_id: { [Sequelize.Op.like]: "demo_%" },
      },
      {},
    );
  },
};
