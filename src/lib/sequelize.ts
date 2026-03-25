import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const sequelize = new Sequelize(
  process.env.DB_NAME || "weinsure_dev",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true" ||
        (process.env.DB_HOST &&
          !["localhost", "127.0.0.1"].includes(process.env.DB_HOST))
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  },
);

export default sequelize;
