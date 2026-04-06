"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("leads", "referred_by_agent_id", {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "agents",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("leads", "referred_by_agent_id");
  },
};
