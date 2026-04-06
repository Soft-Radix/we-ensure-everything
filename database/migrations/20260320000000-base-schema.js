"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 0. Check if the baseline has already been established by existing tables
    // (This prevents breaking existing databases that followed schema.sql manually)
    const tables = await queryInterface.showAllTables();
    if (tables.includes("agents")) {
      console.log("Baseline migration skipped: Database tables already exist.");
      return;
    }

    // 1. COUNTIES
    await queryInterface.createTable("counties", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      state_abbr: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },
      fips_code: {
        type: Sequelize.STRING(5),
        allowNull: true,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 2. CATEGORIES
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      icon: {
        type: Sequelize.STRING(255),
      },
      sort_order: {
        type: Sequelize.TINYINT.UNSIGNED,
        defaultValue: 0,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 3. PRODUCTS
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      code: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      sort_order: {
        type: Sequelize.TINYINT.UNSIGNED,
        defaultValue: 0,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 4. AGENTS (Original Version with first_name and last_name)
    await queryInterface.createTable("agents", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      ghl_user_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      state_abbr: {
        type: Sequelize.CHAR(2),
        allowNull: true,
      },
      county: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      product: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      license_no: {
        type: Sequelize.STRING(100),
      },
      license_state: {
        type: Sequelize.CHAR(2),
      },
      bio: {
        type: Sequelize.TEXT,
      },
      photo_url: {
        type: Sequelize.STRING(500),
      },
      website_url: {
        type: Sequelize.STRING(500),
      },
      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    // 5. SEATS
    await queryInterface.createTable("seats", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      county_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "counties",
          key: "id",
        },
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      agent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "agents",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      assigned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    // 6. WAITLIST
    await queryInterface.createTable("waitlist", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      county_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "counties",
          key: "id",
        },
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      agent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "agents",
          key: "id",
        },
      },
      position: {
        type: Sequelize.TINYINT.UNSIGNED,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.ENUM("waiting", "promoted", "cancelled"),
        defaultValue: "waiting",
      },
      notified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    // 7. LEADS
    await queryInterface.createTable("leads", {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
      },
      county_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "counties",
          key: "id",
        },
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      first_name: {
        type: Sequelize.STRING(100),
      },
      last_name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(255),
      },
      phone: {
        type: Sequelize.STRING(30),
      },
      assigned_agent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "agents",
          key: "id",
        },
      },
      routing_status: {
        type: Sequelize.ENUM("assigned", "no_agent", "waitlisted", "error"),
        allowNull: false,
      },
      ghl_contact_id: {
        type: Sequelize.STRING(100),
      },
      ghl_pipeline_id: {
        type: Sequelize.STRING(100),
      },
      idempotency_key: {
        type: Sequelize.STRING(255),
        unique: true,
      },
      source: {
        type: Sequelize.STRING(50),
        defaultValue: "website",
      },
      ip_address: {
        type: Sequelize.STRING(45),
      },
      routed_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 8. ROUTING LOGS
    await queryInterface.createTable("routing_logs", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      lead_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      event: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.ENUM("success", "failure", "retry"),
        defaultValue: "success",
      },
      latency_ms: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      error_msg: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes for products and leads (from schema.sql)
    await queryInterface.addIndex("products", ["category_id", "code"], {
      unique: true,
      name: "uk_cat_code",
    });
    await queryInterface.addIndex(
      "seats",
      ["county_id", "category_id", "product_id"],
      {
        unique: true,
        name: "uk_seat",
      },
    );
  },

  async down(queryInterface) {
    // Drop tables in reverse order of dependencies
    await queryInterface.dropTable("routing_logs");
    await queryInterface.dropTable("leads");
    await queryInterface.dropTable("waitlist");
    await queryInterface.dropTable("seats");
    await queryInterface.dropTable("agents");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("categories");
    await queryInterface.dropTable("counties");
  },
};
