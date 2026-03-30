import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Sequelize pulls in drivers for every dialect at import time.
      // We only use MySQL (mysql2), so tell webpack to skip the rest.
      config.externals = [
        ...(config.externals as string[]),
        "pg",
        "pg-hstore",
        "pg-native",
        "tedious", // MSSQL
        "oracledb", // Oracle
        "sqlite3", // SQLite
        "better-sqlite3", // SQLite alternative
        "mariadb", // MariaDB
      ];
    }
    return config;
  },
};

export default nextConfig;
