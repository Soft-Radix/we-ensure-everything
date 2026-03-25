"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Clear existing products
    await queryInterface.bulkDelete("products", null, {});

    // Get categories to map codes to IDs
    const [categories] = await queryInterface.sequelize.query(
      "SELECT id, code FROM categories",
    );

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.code] = cat.id;
    });

    const productsData = [
      // AUTO_VEHICLE
      { cat: "AUTO_VEHICLE", code: "AUTO", name: "Auto" },
      { cat: "AUTO_VEHICLE", code: "BUSINESS_AUTO", name: "Business Auto" },
      { cat: "AUTO_VEHICLE", code: "CLASSIC_CAR", name: "Classic Car" },
      { cat: "AUTO_VEHICLE", code: "MOTORCYCLE", name: "Motorcycle" },
      { cat: "AUTO_VEHICLE", code: "OFF_ROAD", name: "Off Road Vehicle" },
      { cat: "AUTO_VEHICLE", code: "RV", name: "RV" },
      { cat: "AUTO_VEHICLE", code: "SR22", name: "SR-22" },
      { cat: "AUTO_VEHICLE", code: "SNOWMOBILE", name: "Snowmobile" },
      { cat: "AUTO_VEHICLE", code: "WATERCRAFT", name: "Watercraft" },
      { cat: "AUTO_VEHICLE", code: "YACHT", name: "Yacht" },

      // PROPERTY_CASUALTY
      { cat: "PROPERTY_CASUALTY", code: "CONDO", name: "Condo" },
      { cat: "PROPERTY_CASUALTY", code: "FLOOD", name: "Flood" },
      { cat: "PROPERTY_CASUALTY", code: "HOME", name: "Home" },
      { cat: "PROPERTY_CASUALTY", code: "HOME_AUTO", name: "Home & Auto" },
      {
        cat: "PROPERTY_CASUALTY",
        code: "HOME_WARRANTY",
        name: "Home Warranty",
      },
      {
        cat: "PROPERTY_CASUALTY",
        code: "LANDLORD_RENTAL",
        name: "Landlord & Rental Prop",
      },
      { cat: "PROPERTY_CASUALTY", code: "MOBILE_HOME", name: "Mobile Home" },
      {
        cat: "PROPERTY_CASUALTY",
        code: "RENTAL_PROP",
        name: "Rental Property",
      },
      { cat: "PROPERTY_CASUALTY", code: "RENTER", name: "Renter" },
      {
        cat: "PROPERTY_CASUALTY",
        code: "SECONDARY_HOME",
        name: "Secondary Home",
      },
      {
        cat: "PROPERTY_CASUALTY",
        code: "SHORT_TERM_RENTAL",
        name: "Short Term Rental",
      },
      { cat: "PROPERTY_CASUALTY", code: "SINKHOLE", name: "Sinkhole" },
      { cat: "PROPERTY_CASUALTY", code: "UMBRELLA", name: "Umbrella" },
      { cat: "PROPERTY_CASUALTY", code: "VACANT_HOME", name: "Vacant Home" },
      {
        cat: "PROPERTY_CASUALTY",
        code: "VALUABLE_POSS",
        name: "Valuable Possessions",
      },

      // HEALTH
      { cat: "HEALTH", code: "FSA", name: "FSA" },
      { cat: "HEALTH", code: "HAS", name: "HSA (HAS)" },
      { cat: "HEALTH", code: "HRA", name: "HRA" },
      { cat: "HEALTH", code: "GROUP_ACCIDENT", name: "Group Accident" },
      { cat: "HEALTH", code: "GROUP_DENTAL", name: "Group Dental" },
      { cat: "HEALTH", code: "GROUP_HEALTH", name: "Group Health" },
      { cat: "HEALTH", code: "GROUP_HOSPITAL", name: "Group Hospital" },
      { cat: "HEALTH", code: "GROUP_TELEMEDICINE", name: "Group Telemedicine" },
      { cat: "HEALTH", code: "GROUP_VISION", name: "Group Vision" },
      { cat: "HEALTH", code: "INDIV_DENTAL", name: "Indiv Dental" },
      { cat: "HEALTH", code: "INDIV_TELEMEDICINE", name: "Indiv Telemedicine" },
      { cat: "HEALTH", code: "INDIV_VISION", name: "Indiv Vision" },
      { cat: "HEALTH", code: "MEDICARE", name: "Medicare" },
      {
        cat: "HEALTH",
        code: "GROUP_VOLUNTARY",
        name: "Group Voluntary Benefits",
      },

      // LIFE_DISABILITY
      { cat: "LIFE_DISABILITY", code: "401K", name: "401K" },
      { cat: "LIFE_DISABILITY", code: "ANNUITIES", name: "Annuities" },
      { cat: "LIFE_DISABILITY", code: "IRA", name: "IRA" },
      { cat: "LIFE_DISABILITY", code: "CHILD_LIFE", name: "Child Life" },
      {
        cat: "LIFE_DISABILITY",
        code: "CRITICAL_ILLNESS",
        name: "Critical Illness",
      },
      { cat: "LIFE_DISABILITY", code: "DISABILITY", name: "Disability" },
      {
        cat: "LIFE_DISABILITY",
        code: "GROUP_SUPP_LIFE",
        name: "Group Supplemental Life",
      },
      { cat: "LIFE_DISABILITY", code: "INDIV_LIFE", name: "Indiv Life" },
      { cat: "LIFE_DISABILITY", code: "KEY_PERSON", name: "Key Person Life" },
      { cat: "LIFE_DISABILITY", code: "LIFE_AD_D", name: "Life and AD&D" },
      { cat: "LIFE_DISABILITY", code: "LTC", name: "LTC" },
      { cat: "LIFE_DISABILITY", code: "LTD", name: "LTD" },
      {
        cat: "LIFE_DISABILITY",
        code: "MORTGAGE_PROT",
        name: "Mortgage Protection",
      },

      // BUSINESS_COMMERCIAL
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "BUILDERS_RISK",
        name: "Builders Risk",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "BUSINESS_INTERRUPTION",
        name: "Business Interruption",
      },
      { cat: "BUSINESS_COMMERCIAL", code: "BOP", name: "Business owners" },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "CAPTIVE",
        name: "Captive Insurance",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "COMM_BONDS",
        name: "Commercial Bonds",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "COMM_CONSTRUCTION",
        name: "Commercial Construction",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "COMM_HURRICANE",
        name: "Commercial Hurricane",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "COMM_PROPERTY",
        name: "Commercial Property",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "COMM_UMBRELLA",
        name: "Commercial Umbrella",
      },
      { cat: "BUSINESS_COMMERCIAL", code: "CRIME", name: "Crime" },
      { cat: "BUSINESS_COMMERCIAL", code: "CYBER", name: "Cyber Liability" },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "D_O",
        name: "Directors & Officers Liability",
      },
      { cat: "BUSINESS_COMMERCIAL", code: "E_O", name: "E&O" },
      { cat: "BUSINESS_COMMERCIAL", code: "EAP", name: "Employee Assist Plan" },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "EPLI",
        name: "Employment Practice Liability",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "ENVIRONMENTAL",
        name: "Environmental",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "EXCESS_LIABILITY",
        name: "Excess Liability",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "FIDUCIARY",
        name: "Fiduciary Liability",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "GEN_LIABILITY",
        name: "Gen Liability",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "INLAND_MARINE",
        name: "Inland Marine",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "LIQUOR_LIABILITY",
        name: "Liquor Liability",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "OCEAN_MARINE",
        name: "Ocean Marine",
      },
      { cat: "BUSINESS_COMMERCIAL", code: "PAYROLL_HR", name: "Payroll/HR" },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "RISK_MGMT",
        name: "Risk Management",
      },
      { cat: "BUSINESS_COMMERCIAL", code: "SURETY_BOND", name: "Surety Bond" },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "SYSTEMS_BREAKDOWN",
        name: "Systems Breakdown",
      },
      {
        cat: "BUSINESS_COMMERCIAL",
        code: "WORKERS_COMP",
        name: "Workers Comp",
      },

      // NICHE_SPECIALTY
      {
        cat: "NICHE_SPECIALTY",
        code: "DEBT_SETTLEMENT",
        name: "Debt Settlement",
      },
      { cat: "NICHE_SPECIALTY", code: "EVENT", name: "Event" },
      { cat: "NICHE_SPECIALTY", code: "SPECIAL_EVENT", name: "Special Event" },
      { cat: "NICHE_SPECIALTY", code: "WEDDING", name: "Wedding" },
      {
        cat: "NICHE_SPECIALTY",
        code: "IDENTITY_THEFT",
        name: "Identity Theft",
      },
      { cat: "NICHE_SPECIALTY", code: "LEGAL", name: "Legal" },
      { cat: "NICHE_SPECIALTY", code: "TAX_ADVISORY", name: "Tax Advisory" },
      {
        cat: "NICHE_SPECIALTY",
        code: "NATURAL_DISASTER",
        name: "Natural Disaster",
      },
      { cat: "NICHE_SPECIALTY", code: "PET", name: "Pet" },
      { cat: "NICHE_SPECIALTY", code: "PROBATE_BOND", name: "Probate Bond" },
      { cat: "NICHE_SPECIALTY", code: "TRAVEL", name: "Travel" },
      {
        cat: "NICHE_SPECIALTY",
        code: "VACANT_BUILDING",
        name: "Vacant Building",
      },
    ];

    const finalProducts = productsData.map((p, index) => ({
      category_id: categoryMap[p.cat],
      code: p.code,
      name: p.name,
      sort_order: index + 1,
      active: true,
      created_at: new Date(),
    }));

    await queryInterface.bulkInsert("products", finalProducts);

    // Re-enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
