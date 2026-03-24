"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add the new full_name column
    await queryInterface.addColumn("agents", "full_name", {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "", // Temporarily allow empty
      after: "ghl_user_id",
    });

    // 2. Migrate data from first_name and last_name to full_name
    await queryInterface.sequelize.query(
      "UPDATE agents SET full_name = CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))",
    );

    // 3. Remove the first_name and last_name columns
    await queryInterface.removeColumn("agents", "first_name");
    await queryInterface.removeColumn("agents", "last_name");
  },

  async down(queryInterface, Sequelize) {
    // 1. Add first_name and last_name back
    await queryInterface.addColumn("agents", "first_name", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: "ghl_user_id",
    });
    await queryInterface.addColumn("agents", "last_name", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: "first_name",
    });

    // 2. Split full_name back into first_name and last_name (approximated)
    await queryInterface.sequelize.query(`
      UPDATE agents 
      SET 
        first_name = SUBSTRING_INDEX(full_name, ' ', 1),
        last_name = IF(LOCATE(' ', full_name) > 0, SUBSTRING(full_name, LOCATE(' ', full_name) + 1), '')
    `);

    // 3. Remove the full_name column
    await queryInterface.removeColumn("agents", "full_name");
  },
};
