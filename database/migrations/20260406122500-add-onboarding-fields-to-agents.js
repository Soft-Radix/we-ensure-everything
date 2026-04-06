"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "business_name", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "business_website", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "street_address", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "city", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "state", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "country", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "postal_code", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("agents", "district", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "business_name");
    await queryInterface.removeColumn("agents", "business_website");
    await queryInterface.removeColumn("agents", "street_address");
    await queryInterface.removeColumn("agents", "city");
    await queryInterface.removeColumn("agents", "state");
    await queryInterface.removeColumn("agents", "country");
    await queryInterface.removeColumn("agents", "postal_code");
    await queryInterface.removeColumn("agents", "district");
  },
};
