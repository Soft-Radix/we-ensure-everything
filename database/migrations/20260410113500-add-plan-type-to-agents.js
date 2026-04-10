"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "plan_type", {
      type: Sequelize.ENUM("refferal_pro", "agent_pro", "agent_pro_plus"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "plan_type");
    // Note: In some databases, you might also want to drop the ENUM type if it's no longer used.
    // await queryInterface.sequelize.query('DROP TYPE "enum_agents_plan_type";');
  },
};
