"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove the unique constraint/index on fips_code first if it exists
    // (Sequelize usually handles this when dropping the column if it's named standardly,
    // but schema.sql says it's just UNIQUE)

    // 2. Remove the fips_code column
    await queryInterface.removeColumn("counties", "fips_code");

    // 3. Add a unique index on name and state_abbr to prevent duplicates
    await queryInterface.addIndex("counties", ["name", "state_abbr"], {
      unique: true,
      name: "idx_counties_name_state",
    });
  },

  async down(queryInterface, Sequelize) {
    // Add fips_code back if rolling back
    await queryInterface.addColumn("counties", "fips_code", {
      type: Sequelize.STRING(5),
      allowNull: true, // Make it nullable as we might not have the data anymore
      unique: true,
    });

    // Remove the unique index
    await queryInterface.removeIndex("counties", "idx_counties_name_state");
  },
};
