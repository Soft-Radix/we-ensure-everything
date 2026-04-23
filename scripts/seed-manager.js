/**
 * SEED MANAGER
 * This script controls which seeders are executed when running 'npm run db:seed'.
 * To disable a seeder, simply comment it out in the 'ENABLED_SEEDERS' array below.
 */

const { execSync } = require("child_process");

const ENABLED_SEEDERS = [
  "20260325114500-seed-states.js",
  "20260325124000-seed-counties.js",
  "20260325143000-seed-categories.js",
  "20260325161000-seed-products.js",

  // Agent related seeders (Commented out by default to protect production data)
  "20260325163000-seed-agents.js",
  "20260325164000-seed-demo-agents.js",
  "20260325170000-seed-seats.js",
  // "20260401183000-replace-agents-and-seats.js",
  "20260402072949-seed-admin-user.js",
];

console.log("Starting Seeding Process...");

ENABLED_SEEDERS.forEach((seeder) => {
  console.log(`\n>>> Running: ${seeder}`);
  try {
    execSync(
      `npx sequelize-cli db:seed --seed ${seeder} --config database/config.js`,
      { stdio: "inherit" },
    );
  } catch {
    console.error(`\n[ERROR] Seeder failed: ${seeder}`);
    process.exit(1);
  }
});

console.log("\nAll enabled seeders completed successfully.");
