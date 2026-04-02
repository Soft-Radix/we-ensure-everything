"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "state_abbr");
    await queryInterface.removeColumn("agents", "county");
    await queryInterface.removeColumn("agents", "category");
    await queryInterface.removeColumn("agents", "product");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "state_abbr", {
      type: Sequelize.CHAR(2),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "county", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "category", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "product", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },
};
