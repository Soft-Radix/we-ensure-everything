const mysql = require("mysql2/promise");
// We use the same config as Sequelize to stay consistent
const config = require("../database/config.js");

// Determine environment
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

async function init() {
  console.log(`Starting Database Initialization for environment: ${env}`);

  const { host, port, username, password, database } = dbConfig;

  try {
    // 1. Connect to MySQL without a database selected
    const connection = await mysql.createConnection({
      host,
      port: port || 3306,
      user: username,
      password,
    });

    console.log(`Connected to host: ${host}`);

    // 2. Create the database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );
    console.log(`Database "${database}" initialized (created if not existed).`);

    await connection.end();

    console.log(
      "\nSuccess: Database schema exists. You can now run migrations.",
    );
    console.log("Next steps:");
    console.log("  npx sequelize-cli db:migrate");
    console.log("  npx sequelize-cli db:seed:all");
  } catch (error) {
    console.error("\nError during database initialization:");
    console.error(error.message);
    process.exit(1);
  }
}

init();
