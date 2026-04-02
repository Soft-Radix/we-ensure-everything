"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "admin",
          email: "admin@weinsureeverything.com",
          password_hash: passwordHash,
          role: "superadmin",
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { username: "admin" }, {});
  },
};
