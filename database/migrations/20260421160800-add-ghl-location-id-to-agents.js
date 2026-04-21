"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "ghl_location_id", {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
      after: "ghl_api_key",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "ghl_location_id");
  },
};
