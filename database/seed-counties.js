#!/usr/bin/env node
/**
 * Seed U.S. Counties into MySQL
 * Run: node database/seed-counties.js
 *
 * Uses the free public dataset of U.S. counties by FIPS code.
 * This script inserts a representative sample of all 50 states.
 * For production, replace with the full 3,143-county dataset.
 */

// Sample of all 50 states × representative counties
// Full seed: import from a CSV with all 3143 counties
const counties = [
  // Alabama
  { fips: "01001", name: "Autauga", state: "Alabama", abbr: "AL" },
  { fips: "01003", name: "Baldwin", state: "Alabama", abbr: "AL" },
  { fips: "01005", name: "Barbour", state: "Alabama", abbr: "AL" },
  { fips: "01097", name: "Mobile", state: "Alabama", abbr: "AL" },
  { fips: "01073", name: "Jefferson", state: "Alabama", abbr: "AL" },
  // Alaska
  { fips: "02020", name: "Anchorage", state: "Alaska", abbr: "AK" },
  { fips: "02090", name: "Fairbanks North Star", state: "Alaska", abbr: "AK" },
  // Arizona
  { fips: "04013", name: "Maricopa", state: "Arizona", abbr: "AZ" },
  { fips: "04019", name: "Pima", state: "Arizona", abbr: "AZ" },
  { fips: "04021", name: "Pinal", state: "Arizona", abbr: "AZ" },
  // Arkansas
  { fips: "05119", name: "Pulaski", state: "Arkansas", abbr: "AR" },
  { fips: "05007", name: "Benton", state: "Arkansas", abbr: "AR" },
  // California
  { fips: "06037", name: "Los Angeles", state: "California", abbr: "CA" },
  { fips: "06059", name: "Orange", state: "California", abbr: "CA" },
  { fips: "06073", name: "San Diego", state: "California", abbr: "CA" },
  { fips: "06065", name: "Riverside", state: "California", abbr: "CA" },
  { fips: "06071", name: "San Bernardino", state: "California", abbr: "CA" },
  { fips: "06001", name: "Alameda", state: "California", abbr: "CA" },
  { fips: "06067", name: "Sacramento", state: "California", abbr: "CA" },
  { fips: "06085", name: "Santa Clara", state: "California", abbr: "CA" },
  { fips: "06075", name: "San Francisco", state: "California", abbr: "CA" },
  // Colorado
  { fips: "08031", name: "Denver", state: "Colorado", abbr: "CO" },
  { fips: "08005", name: "Arapahoe", state: "Colorado", abbr: "CO" },
  { fips: "08013", name: "Boulder", state: "Colorado", abbr: "CO" },
  // Connecticut
  { fips: "09003", name: "Hartford", state: "Connecticut", abbr: "CT" },
  { fips: "09009", name: "New Haven", state: "Connecticut", abbr: "CT" },
  // Delaware
  { fips: "10003", name: "New Castle", state: "Delaware", abbr: "DE" },
  // Florida
  { fips: "12086", name: "Miami-Dade", state: "Florida", abbr: "FL" },
  { fips: "12011", name: "Broward", state: "Florida", abbr: "FL" },
  { fips: "12099", name: "Palm Beach", state: "Florida", abbr: "FL" },
  { fips: "12057", name: "Hillsborough", state: "Florida", abbr: "FL" },
  { fips: "12095", name: "Orange", state: "Florida", abbr: "FL" },
  { fips: "12031", name: "Duval", state: "Florida", abbr: "FL" },
  { fips: "12103", name: "Pinellas", state: "Florida", abbr: "FL" },
  { fips: "12009", name: "Brevard", state: "Florida", abbr: "FL" },
  // Georgia
  { fips: "13121", name: "Fulton", state: "Georgia", abbr: "GA" },
  { fips: "13067", name: "Cobb", state: "Georgia", abbr: "GA" },
  { fips: "13089", name: "DeKalb", state: "Georgia", abbr: "GA" },
  // Hawaii
  { fips: "15003", name: "Honolulu", state: "Hawaii", abbr: "HI" },
  // Idaho
  { fips: "16001", name: "Ada", state: "Idaho", abbr: "ID" },
  { fips: "16055", name: "Kootenai", state: "Idaho", abbr: "ID" },
  // Illinois
  { fips: "17031", name: "Cook", state: "Illinois", abbr: "IL" },
  { fips: "17043", name: "DuPage", state: "Illinois", abbr: "IL" },
  { fips: "17097", name: "Lake", state: "Illinois", abbr: "IL" },
  // Indiana
  { fips: "18097", name: "Marion", state: "Indiana", abbr: "IN" },
  { fips: "18141", name: "St. Joseph", state: "Indiana", abbr: "IN" },
  // Iowa
  { fips: "19153", name: "Polk", state: "Iowa", abbr: "IA" },
  { fips: "19013", name: "Black Hawk", state: "Iowa", abbr: "IA" },
  // Kansas
  { fips: "20091", name: "Johnson", state: "Kansas", abbr: "KS" },
  { fips: "20173", name: "Sedgwick", state: "Kansas", abbr: "KS" },
  // Kentucky
  { fips: "21111", name: "Jefferson", state: "Kentucky", abbr: "KY" },
  { fips: "21067", name: "Fayette", state: "Kentucky", abbr: "KY" },
  // Louisiana
  { fips: "22071", name: "Orleans", state: "Louisiana", abbr: "LA" },
  { fips: "22033", name: "East Baton Rouge", state: "Louisiana", abbr: "LA" },
  // Maine
  { fips: "23005", name: "Cumberland", state: "Maine", abbr: "ME" },
  // Maryland
  { fips: "24031", name: "Montgomery", state: "Maryland", abbr: "MD" },
  { fips: "24003", name: "Prince George's", state: "Maryland", abbr: "MD" },
  { fips: "24005", name: "Anne Arundel", state: "Maryland", abbr: "MD" },
  // Massachusetts
  { fips: "25025", name: "Suffolk", state: "Massachusetts", abbr: "MA" },
  { fips: "25017", name: "Middlesex", state: "Massachusetts", abbr: "MA" },
  { fips: "25027", name: "Worcester", state: "Massachusetts", abbr: "MA" },
  // Michigan
  { fips: "26163", name: "Wayne", state: "Michigan", abbr: "MI" },
  { fips: "26125", name: "Oakland", state: "Michigan", abbr: "MI" },
  { fips: "26081", name: "Kent", state: "Michigan", abbr: "MI" },
  // Minnesota
  { fips: "27053", name: "Hennepin", state: "Minnesota", abbr: "MN" },
  { fips: "27123", name: "Ramsey", state: "Minnesota", abbr: "MN" },
  // Mississippi
  { fips: "28049", name: "Hinds", state: "Mississippi", abbr: "MS" },
  // Missouri
  { fips: "29189", name: "St. Louis", state: "Missouri", abbr: "MO" },
  { fips: "29095", name: "Jackson", state: "Missouri", abbr: "MO" },
  // Montana
  { fips: "30049", name: "Lewis and Clark", state: "Montana", abbr: "MT" },
  // Nebraska
  { fips: "31055", name: "Douglas", state: "Nebraska", abbr: "NE" },
  { fips: "31109", name: "Lancaster", state: "Nebraska", abbr: "NE" },
  // Nevada
  { fips: "32003", name: "Clark", state: "Nevada", abbr: "NV" },
  { fips: "32031", name: "Washoe", state: "Nevada", abbr: "NV" },
  // New Hampshire
  { fips: "33011", name: "Hillsborough", state: "New Hampshire", abbr: "NH" },
  // New Jersey
  { fips: "34013", name: "Essex", state: "New Jersey", abbr: "NJ" },
  { fips: "34039", name: "Union", state: "New Jersey", abbr: "NJ" },
  { fips: "34017", name: "Hudson", state: "New Jersey", abbr: "NJ" },
  // New Mexico
  { fips: "35001", name: "Bernalillo", state: "New Mexico", abbr: "NM" },
  { fips: "35013", name: "Doña Ana", state: "New Mexico", abbr: "NM" },
  // New York
  {
    fips: "36061",
    name: "New York (Manhattan)",
    state: "New York",
    abbr: "NY",
  },
  { fips: "36047", name: "Kings (Brooklyn)", state: "New York", abbr: "NY" },
  { fips: "36081", name: "Queens", state: "New York", abbr: "NY" },
  { fips: "36059", name: "Nassau", state: "New York", abbr: "NY" },
  { fips: "36103", name: "Suffolk", state: "New York", abbr: "NY" },
  { fips: "36055", name: "Monroe", state: "New York", abbr: "NY" },
  // North Carolina
  { fips: "37119", name: "Mecklenburg", state: "North Carolina", abbr: "NC" },
  { fips: "37183", name: "Wake", state: "North Carolina", abbr: "NC" },
  { fips: "37081", name: "Guilford", state: "North Carolina", abbr: "NC" },
  // North Dakota
  { fips: "38017", name: "Cass", state: "North Dakota", abbr: "ND" },
  // Ohio
  { fips: "39035", name: "Cuyahoga", state: "Ohio", abbr: "OH" },
  { fips: "39049", name: "Franklin", state: "Ohio", abbr: "OH" },
  { fips: "39061", name: "Hamilton", state: "Ohio", abbr: "OH" },
  { fips: "39113", name: "Montgomery", state: "Ohio", abbr: "OH" },
  // Oklahoma
  { fips: "40109", name: "Oklahoma", state: "Oklahoma", abbr: "OK" },
  { fips: "40143", name: "Tulsa", state: "Oklahoma", abbr: "OK" },
  // Oregon
  { fips: "41051", name: "Multnomah", state: "Oregon", abbr: "OR" },
  { fips: "41067", name: "Washington", state: "Oregon", abbr: "OR" },
  // Pennsylvania
  { fips: "42101", name: "Philadelphia", state: "Pennsylvania", abbr: "PA" },
  { fips: "42003", name: "Allegheny", state: "Pennsylvania", abbr: "PA" },
  { fips: "42091", name: "Montgomery", state: "Pennsylvania", abbr: "PA" },
  // Rhode Island
  { fips: "44007", name: "Providence", state: "Rhode Island", abbr: "RI" },
  // South Carolina
  { fips: "45045", name: "Greenville", state: "South Carolina", abbr: "SC" },
  { fips: "45019", name: "Charleston", state: "South Carolina", abbr: "SC" },
  // South Dakota
  { fips: "46099", name: "Minnehaha", state: "South Dakota", abbr: "SD" },
  // Tennessee
  { fips: "47157", name: "Shelby", state: "Tennessee", abbr: "TN" },
  { fips: "47037", name: "Davidson", state: "Tennessee", abbr: "TN" },
  { fips: "47093", name: "Knox", state: "Tennessee", abbr: "TN" },
  // Texas
  { fips: "48201", name: "Harris", state: "Texas", abbr: "TX" },
  { fips: "48113", name: "Dallas", state: "Texas", abbr: "TX" },
  { fips: "48029", name: "Bexar", state: "Texas", abbr: "TX" },
  { fips: "48439", name: "Tarrant", state: "Texas", abbr: "TX" },
  { fips: "48453", name: "Travis", state: "Texas", abbr: "TX" },
  { fips: "48141", name: "El Paso", state: "Texas", abbr: "TX" },
  { fips: "48167", name: "Fort Bend", state: "Texas", abbr: "TX" },
  // Utah
  { fips: "49035", name: "Salt Lake", state: "Utah", abbr: "UT" },
  { fips: "49049", name: "Utah", state: "Utah", abbr: "UT" },
  // Vermont
  { fips: "50007", name: "Chittenden", state: "Vermont", abbr: "VT" },
  // Virginia
  { fips: "51059", name: "Fairfax", state: "Virginia", abbr: "VA" },
  { fips: "51760", name: "Richmond City", state: "Virginia", abbr: "VA" },
  { fips: "51710", name: "Norfolk City", state: "Virginia", abbr: "VA" },
  // Washington
  { fips: "53033", name: "King", state: "Washington", abbr: "WA" },
  { fips: "53053", name: "Pierce", state: "Washington", abbr: "WA" },
  { fips: "53061", name: "Snohomish", state: "Washington", abbr: "WA" },
  // West Virginia
  { fips: "54039", name: "Kanawha", state: "West Virginia", abbr: "WV" },
  // Wisconsin
  { fips: "55079", name: "Milwaukee", state: "Wisconsin", abbr: "WI" },
  { fips: "55025", name: "Dane", state: "Wisconsin", abbr: "WI" },
  // Wyoming
  { fips: "56021", name: "Laramie", state: "Wyoming", abbr: "WY" },
];

const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "weinsure",
  });

  console.log(`Seeding ${counties.length} counties…`);
  let inserted = 0;

  for (const c of counties) {
    await conn.query(
      `INSERT IGNORE INTO counties (fips_code, name, state, state_abbr)
       VALUES (?, ?, ?, ?)`,
      [c.fips, c.name, c.state, c.abbr],
    );
    inserted++;
  }

  console.log(`✅ Done — ${inserted} counties seeded.`);
  await conn.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
