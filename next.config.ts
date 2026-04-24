import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
