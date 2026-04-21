"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "ghl_api_key", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "ghl_user_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "ghl_api_key");
  },
};
