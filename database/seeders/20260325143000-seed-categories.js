"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Disable foreign key checks for the duration of the seed
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // We need to clear existing categories because the new structure is different
    await queryInterface.bulkDelete("categories", null, {});
    // Clear products as they are tied to old category IDs and codes
    await queryInterface.bulkDelete("products", null, {});

    const categories = [
      {
        code: "AUTO_VEHICLE",
        name: "Auto & Vehicle",
        icon: "/icons/personal.png",
        description: "Coverage for cars, trucks, and other vehicles",
        sort_order: 1,
      },
      {
        code: "PROPERTY_CASUALTY",
        name: "Property & Casualty",
        icon: "/icons/personal.png",
        description: "General property and liability insurance",
        sort_order: 2,
      },
      {
        code: "HEALTH",
        name: "Health",
        icon: "/icons/health.png",
        description: "Individual and group health insurance solutions",
        sort_order: 3,
      },
      {
        code: "LIFE_DISABILITY",
        name: "Life & Disability",
        icon: "/icons/health.png",
        description: "Life insurance and disability protection",
        sort_order: 4,
      },
      {
        code: "BUSINESS_COMMERCIAL",
        name: "Business & Commercial",
        icon: "/icons/commercial.png",
        description: "Comprehensive coverage for businesses of all sizes",
        sort_order: 5,
      },
      {
        code: "NICHE_SPECIALTY",
        name: "Niche & Specialty",
        icon: "/icons/legal.png",
        description: "Specialized and unique insurance products",
        sort_order: 6,
      },
    ];

    await queryInterface.bulkInsert(
      "categories",
      categories.map((c) => ({
        ...c,
        active: true,
        created_at: new Date(),
      })),
      { ignoreDuplicates: true },
    );

    // Re-enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
