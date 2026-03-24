"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "state_abbr", {
      type: Sequelize.CHAR(2),
      allowNull: false,
      defaultValue: "--", // Temporary for compatibility
      after: "phone",
    });
    await queryInterface.addColumn("agents", "county", {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: "--",
      after: "state_abbr",
    });
    await queryInterface.addColumn("agents", "category", {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: "--",
      after: "county",
    });
    await queryInterface.addColumn("agents", "product", {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: "--",
      after: "category",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "product");
    await queryInterface.removeColumn("agents", "category");
    await queryInterface.removeColumn("agents", "county");
    await queryInterface.removeColumn("agents", "state_abbr");
  },
};
