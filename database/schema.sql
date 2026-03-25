-- WeInsureEverything / AgentPro! + ReferralPro! Database Schema
-- MySQL

CREATE DATABASE IF NOT EXISTS weinsure_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE weinsure_dev;

-- ─────────────────────────────────────────────
-- 1. COUNTIES (3,143 U.S. Counties)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS counties (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  state     VARCHAR(50)  NOT NULL,
  state_abbr CHAR(2)     NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_state (state_abbr),
  INDEX idx_name  (name),
  UNIQUE KEY uk_county_state (name, state_abbr)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 2. CATEGORIES (6 Insurance Categories)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(30)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon        VARCHAR(255),
  sort_order  TINYINT UNSIGNED DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 3. PRODUCTS (Sub-categories per Category)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  code        VARCHAR(30)  NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  sort_order  TINYINT UNSIGNED DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_cat_code (category_id, code),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_code (code)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 4. AGENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ghl_user_id  VARCHAR(100) UNIQUE COMMENT 'GoHighLevel User ID',
  full_name   VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(30) NOT NULL UNIQUE,
  state_abbr   CHAR(2) NOT NULL,
  county       VARCHAR(100) NOT NULL,
  category     VARCHAR(100) NOT NULL,
  product      VARCHAR(100) NOT NULL,
  license_no   VARCHAR(100),
  license_state CHAR(2),
  bio          TEXT,
  photo_url    VARCHAR(500),
  website_url  VARCHAR(500),
  status       ENUM('active','inactive','suspended') DEFAULT 'active',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email  (email),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 5. SEATS (County × Category × Product exclusivity)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seats (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  county_id   INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  agent_id    INT UNSIGNED NOT NULL,
  status      ENUM('active','inactive') DEFAULT 'active',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at  TIMESTAMP NULL COMMENT 'NULL = permanent',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_seat (county_id, category_id, product_id) COMMENT 'Exclusive: 1 agent per CCxP',
  CONSTRAINT fk_seat_county   FOREIGN KEY (county_id)   REFERENCES counties(id),
  CONSTRAINT fk_seat_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_seat_product  FOREIGN KEY (product_id)  REFERENCES products(id),
  CONSTRAINT fk_seat_agent    FOREIGN KEY (agent_id)    REFERENCES agents(id),
  INDEX idx_agent  (agent_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 6. WAITLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS waitlist (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  county_id   INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  agent_id    INT UNSIGNED NOT NULL,
  position    TINYINT UNSIGNED DEFAULT 1,
  status      ENUM('waiting','promoted','cancelled') DEFAULT 'waiting',
  notified_at TIMESTAMP NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wl_county   FOREIGN KEY (county_id)   REFERENCES counties(id),
  CONSTRAINT fk_wl_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_wl_product  FOREIGN KEY (product_id)  REFERENCES products(id),
  CONSTRAINT fk_wl_agent    FOREIGN KEY (agent_id)    REFERENCES agents(id),
  INDEX idx_wl_status (status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 7. CONSUMER LEADS (Routing Requests)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id              CHAR(36)     PRIMARY KEY COMMENT 'UUID',
  county_id       INT UNSIGNED NOT NULL,
  category_id     INT UNSIGNED NOT NULL,
  product_id      INT UNSIGNED NOT NULL,
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  email           VARCHAR(255),
  phone           VARCHAR(30),
  assigned_agent_id INT UNSIGNED NULL,
  routing_status  ENUM('assigned','no_agent','waitlisted','error') NOT NULL,
  ghl_contact_id  VARCHAR(100) COMMENT 'GoHighLevel Contact ID',
  ghl_pipeline_id VARCHAR(100),
  idempotency_key VARCHAR(255) UNIQUE COMMENT 'Prevents duplicate routing within 24h',
  source          VARCHAR(50) DEFAULT 'website',
  ip_address      VARCHAR(45),
  routed_at       TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lead_county   FOREIGN KEY (county_id)   REFERENCES counties(id),
  CONSTRAINT fk_lead_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_lead_product  FOREIGN KEY (product_id)  REFERENCES products(id),
  CONSTRAINT fk_lead_agent    FOREIGN KEY (assigned_agent_id) REFERENCES agents(id),
  INDEX idx_routing_status (routing_status),
  INDEX idx_created_at     (created_at),
  INDEX idx_email          (email)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 8. ROUTING LOGS (Audit Trail)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routing_logs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id     CHAR(36)      NOT NULL,
  event       VARCHAR(100)  NOT NULL,
  payload     JSON,
  status      ENUM('success','failure','retry') DEFAULT 'success',
  latency_ms  INT UNSIGNED,
  error_msg   TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lead_id   (lead_id),
  INDEX idx_created   (created_at),
  INDEX idx_status    (status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 9. SEED: Categories
-- ─────────────────────────────────────────────
INSERT IGNORE INTO categories (code, name, description, icon, sort_order) VALUES
  ('AUTO_VEHICLE',     'Auto & Vehicle',         'Coverage for cars, trucks, and other vehicles',             '/icons/personal.png',   1),
  ('PROPERTY_CASUALTY','Property & Casualty',   'General property and liability insurance',                  '/icons/personal.png',   2),
  ('HEALTH',           'Health',                 'Individual and group health insurance solutions',           '/icons/health.png',     3),
  ('LIFE_DISABILITY',  'Life & Disability',      'Life insurance and disability protection',                  '/icons/health.png',     4),
  ('BUSINESS_COMMERCIAL','Business & Commercial','Comprehensive coverage for businesses of all sizes',        '/icons/commercial.png', 5),
  ('NICHE_SPECIALTY',  'Niche & Specialty',      'Specialized and unique insurance products',                 '/icons/legal.png',      6);

-- ─────────────────────────────────────────────
-- 10. SEED: Products
-- ─────────────────────────────────────────────
INSERT IGNORE INTO products (category_id, code, name, sort_order)
SELECT c.id, p.code, p.name, p.sort_order FROM categories c
JOIN (
  -- AUTO_VEHICLE
  SELECT 'AUTO_VEHICLE' AS cat, 'AUTO' AS code, 'Auto' AS name, 1 AS sort_order UNION ALL
  SELECT 'AUTO_VEHICLE', 'BUSINESS_AUTO', 'Business Auto', 2 UNION ALL
  SELECT 'AUTO_VEHICLE', 'CLASSIC_CAR', 'Classic Car', 3 UNION ALL
  SELECT 'AUTO_VEHICLE', 'MOTORCYCLE', 'Motorcycle', 4 UNION ALL
  SELECT 'AUTO_VEHICLE', 'OFF_ROAD', 'Off Road Vehicle', 5 UNION ALL
  SELECT 'AUTO_VEHICLE', 'RV', 'RV', 6 UNION ALL
  SELECT 'AUTO_VEHICLE', 'SR22', 'SR-22', 7 UNION ALL
  SELECT 'AUTO_VEHICLE', 'SNOWMOBILE', 'Snowmobile', 8 UNION ALL
  SELECT 'AUTO_VEHICLE', 'WATERCRAFT', 'Watercraft', 9 UNION ALL
  SELECT 'AUTO_VEHICLE', 'YACHT', 'Yacht', 10 UNION ALL

  -- PROPERTY_CASUALTY
  SELECT 'PROPERTY_CASUALTY', 'CONDO', 'Condo', 11 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'FLOOD', 'Flood', 12 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'HOME', 'Home', 13 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'HOME_AUTO', 'Home & Auto', 14 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'HOME_WARRANTY', 'Home Warranty', 15 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'LANDLORD_RENTAL', 'Landlord & Rental Prop', 16 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'MOBILE_HOME', 'Mobile Home', 17 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'RENTAL_PROP', 'Rental Property', 18 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'RENTER', 'Renter', 19 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'SECONDARY_HOME', 'Secondary Home', 20 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'SHORT_TERM_RENTAL', 'Short Term Rental', 21 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'SINKHOLE', 'Sinkhole', 22 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'UMBRELLA', 'Umbrella', 23 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'VACANT_HOME', 'Vacant Home', 24 UNION ALL
  SELECT 'PROPERTY_CASUALTY', 'VALUABLE_POSS', 'Valuable Possessions', 25 UNION ALL

  -- HEALTH
  SELECT 'HEALTH', 'FSA', 'FSA', 26 UNION ALL
  SELECT 'HEALTH', 'HAS', 'HSA (HAS)', 27 UNION ALL
  SELECT 'HEALTH', 'HRA', 'HRA', 28 UNION ALL
  SELECT 'HEALTH', 'GROUP_ACCIDENT', 'Group Accident', 29 UNION ALL
  SELECT 'HEALTH', 'GROUP_DENTAL', 'Group Dental', 30 UNION ALL
  SELECT 'HEALTH', 'GROUP_HEALTH', 'Group Health', 31 UNION ALL
  SELECT 'HEALTH', 'GROUP_HOSPITAL', 'Group Hospital', 32 UNION ALL
  SELECT 'HEALTH', 'GROUP_TELEMEDICINE', 'Group Telemedicine', 33 UNION ALL
  SELECT 'HEALTH', 'GROUP_VISION', 'Group Vision', 34 UNION ALL
  SELECT 'HEALTH', 'INDIV_DENTAL', 'Indiv Dental', 35 UNION ALL
  SELECT 'HEALTH', 'INDIV_TELEMEDICINE', 'Indiv Telemedicine', 36 UNION ALL
  SELECT 'HEALTH', 'INDIV_VISION', 'Indiv Vision', 37 UNION ALL
  SELECT 'HEALTH', 'MEDICARE', 'Medicare', 38 UNION ALL
  SELECT 'HEALTH', 'GROUP_VOLUNTARY', 'Group Voluntary Benefits', 39 UNION ALL

  -- LIFE_DISABILITY
  SELECT 'LIFE_DISABILITY', '401K', '401K', 40 UNION ALL
  SELECT 'LIFE_DISABILITY', 'ANNUITIES', 'Annuities', 41 UNION ALL
  SELECT 'LIFE_DISABILITY', 'IRA', 'IRA', 42 UNION ALL
  SELECT 'LIFE_DISABILITY', 'CHILD_LIFE', 'Child Life', 43 UNION ALL
  SELECT 'LIFE_DISABILITY', 'CRITICAL_ILLNESS', 'Critical Illness', 44 UNION ALL
  SELECT 'LIFE_DISABILITY', 'DISABILITY', 'Disability', 45 UNION ALL
  SELECT 'LIFE_DISABILITY', 'GROUP_SUPP_LIFE', 'Group Supplemental Life', 46 UNION ALL
  SELECT 'LIFE_DISABILITY', 'INDIV_LIFE', 'Indiv Life', 47 UNION ALL
  SELECT 'LIFE_DISABILITY', 'KEY_PERSON', 'Key Person Life', 48 UNION ALL
  SELECT 'LIFE_DISABILITY', 'LIFE_AD_D', 'Life and AD&D', 49 UNION ALL
  SELECT 'LIFE_DISABILITY', 'LTC', 'LTC', 50 UNION ALL
  SELECT 'LIFE_DISABILITY', 'LTD', 'LTD', 51 UNION ALL
  SELECT 'LIFE_DISABILITY', 'MORTGAGE_PROT', 'Mortgage Protection', 52 UNION ALL

  -- BUSINESS_COMMERCIAL
  SELECT 'BUSINESS_COMMERCIAL', 'BUILDERS_RISK', 'Builders Risk', 53 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'BUSINESS_INTERRUPTION', 'Business Interruption', 54 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'BOP', 'Business owners', 55 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'CAPTIVE', 'Captive Insurance', 56 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'COMM_BONDS', 'Commercial Bonds', 57 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'COMM_CONSTRUCTION', 'Commercial Construction', 58 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'COMM_HURRICANE', 'Commercial Hurricane', 59 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'COMM_PROPERTY', 'Commercial Property', 60 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'COMM_UMBRELLA', 'Commercial Umbrella', 61 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'CRIME', 'Crime', 62 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'CYBER', 'Cyber Liability', 63 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'D_O', 'Directors & Officers Liability', 64 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'E_O', 'E&O', 65 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'EAP', 'Employee Assist Plan', 66 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'EPLI', 'Employment Practice Liability', 67 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'ENVIRONMENTAL', 'Environmental', 68 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'EXCESS_LIABILITY', 'Excess Liability', 69 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'FIDUCIARY', 'Fiduciary Liability', 70 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'GEN_LIABILITY', 'Gen Liability', 71 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'INLAND_MARINE', 'Inland Marine', 72 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'LIQUOR_LIABILITY', 'Liquor Liability', 73 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'OCEAN_MARINE', 'Ocean Marine', 74 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'PAYROLL_HR', 'Payroll/HR', 75 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'RISK_MGMT', 'Risk Management', 76 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'SURETY_BOND', 'Surety Bond', 77 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'SYSTEMS_BREAKDOWN', 'Systems Breakdown', 78 UNION ALL
  SELECT 'BUSINESS_COMMERCIAL', 'WORKERS_COMP', 'Workers Comp', 79 UNION ALL

  -- NICHE_SPECIALTY
  SELECT 'NICHE_SPECIALTY', 'DEBT_SETTLEMENT', 'Debt Settlement', 80 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'EVENT', 'Event', 81 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'SPECIAL_EVENT', 'Special Event', 82 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'WEDDING', 'Wedding', 83 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'IDENTITY_THEFT', 'Identity Theft', 84 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'LEGAL', 'Legal', 85 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'TAX_ADVISORY', 'Tax Advisory', 86 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'NATURAL_DISASTER', 'Natural Disaster', 87 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'PET', 'Pet', 88 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'PROBATE_BOND', 'Probate Bond', 89 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'TRAVEL', 'Travel', 90 UNION ALL
  SELECT 'NICHE_SPECIALTY', 'VACANT_BUILDING', 'Vacant Building', 91
) p ON c.code = p.cat;

-- ─────────────────────────────────────────────
-- 11. SEED: Agents
-- ─────────────────────────────────────────────
INSERT IGNORE INTO agents (ghl_user_id, full_name, email, phone, state_abbr, county, category, product, status) VALUES
  ('ghl_001', 'Brandon Elliott', 'brandon@insureboost.com', '3214503600', 'FL', 'General', 'HEALTH', 'HEALTH', 'inactive'),
  ('ghl_002', 'Corey Jermaine Jackson', 'coreyjackson12@gmail.com', '8133594949', 'FL', 'General', 'LIFE_DISABILITY', 'LIFE', 'inactive'),
  ('ghl_003', 'Cynthia Rodriguez', 'cynthia.rodriguez@simplifiedhealthcaresolution.com', '2158691422', 'FL', 'General', 'HEALTH', 'MEDICARE', 'inactive'),
  ('ghl_004', 'Greg Roe', 'greg@roeins.com', '8132638715', 'FL', 'General', 'BUSINESS_COMMERCIAL', 'COMMERCIAL', 'inactive'),
  ('ghl_005', 'James Sebest', 'james@john-galt.com', '9542143751', 'FL', 'General', 'BUSINESS_COMMERCIAL', 'COMMERCIAL', 'inactive'),
  ('ghl_006', 'Joseph Menachem', 'joseph@markerinsurance.com', '9544567505', 'FL', 'General', 'BUSINESS_COMMERCIAL', 'MARINE', 'inactive'),
  ('ghl_007', 'Ken Tolchin', 'ken@practicalinsurancesolutions.com', '5612128092', 'FL', 'General', 'LIFE_DISABILITY', 'ANNUITIES', 'inactive'),
  ('ghl_008', 'Paul Vawrock', 'paul@vawrock.com', '8139291150', 'FL', 'Pasco', 'HEALTH', 'HEALTH', 'inactive'),
  ('ghl_011', 'Brandon Rapose', 'coveragewithbrandon@gmail.com', '4842744257', 'FL', 'General', 'HEALTH', 'HEALTH', 'inactive'),
  ('ghl_012', 'Mikell Simmons', 'mike@weinsureeverything.com', '9544054015', 'FL', 'General', 'HEALTH', 'HEALTH', 'inactive'),
  ('ghl_013', 'Kenneth Bryant', 'kenneth.bryant@kbagencygroup.com', '4077150906', 'FL', 'General', 'LIFE_DISABILITY', 'LIFE', 'inactive'),
  ('ghl_014', 'Rosalyn Jones', 'rosalyn@rljones.com', '3526423274', 'FL', 'Alachua', 'HEALTH', 'MEDICARE', 'inactive'),
  ('ghl_015', 'Alex Brito', 'alex@singlepointes.com', '7862500016', 'FL', 'Miami-Dade', 'HEALTH', 'GROUP_VOLUNTARY', 'inactive'),
  ('ghl_016', 'Imtiyaz Mavani', 'infinityinsurance2@gmail.com', '14692269495', 'TX', 'General', 'PROPERTY_CASUALTY', 'HOME', 'inactive'),
  ('ghl_017', 'Cat Simmons', 'mikesimmons01@gmail.com', '19544054015', 'AR', 'Pulaski', 'BUSINESS_COMMERCIAL', 'BUILDERS_RISK', 'active'),
  ('ghl_018', 'John Adams', 'jadams@test.com', '13055555555', 'IN', 'Marion', 'AUTO_VEHICLE', 'AUTO', 'active'),
  ('ghl_019', 'Kamal Jones', 'kjones@test.com', '19545555555', 'AK', 'Anchorage', 'PROPERTY_CASUALTY', 'HOME', 'active'),
  ('demo_001', 'Sarah Miller', 'sarah@agentpro-demo.com', '123-456-7890', 'CA', 'Los Angeles', 'AUTO_VEHICLE', 'AUTO', 'active'),
  ('demo_002', 'John Thompson', 'john@agentpro-demo.com', '234-567-8901', 'TX', 'Dallas', 'PROPERTY_CASUALTY', 'HOME', 'active'),
  ('demo_003', 'Elena Rodriguez', 'elena@agentpro-demo.com', '345-678-9012', 'FL', 'Miami-Dade', 'HEALTH', 'GROUP_HEALTH', 'active'),
  ('demo_004', 'David Chen', 'david@agentpro-demo.com', '456-789-0123', 'NY', 'New York', 'LIFE_DISABILITY', 'INDIV_LIFE', 'active'),
  ('demo_005', 'Jessica White', 'jessica@agentpro-demo.com', '567-890-1234', 'IL', 'Cook', 'BUSINESS_COMMERCIAL', 'BOP', 'active'),
  ('demo_010', 'Justin Wu', 'justin@agentpro-demo.com', '012-345-6789', 'OH', 'Franklin', 'BUSINESS_COMMERCIAL', 'CYBER', 'active'),
  ('demo_006', 'Michael Peterson', 'michael@agentpro-demo.com', '678-901-2345', 'GA', 'Fulton', 'NICHE_SPECIALTY', 'TRAVEL', 'active');

-- ─────────────────────────────────────────────
-- 12. SEED: Initial Seats (Exclusives)
-- ─────────────────────────────────────────────
INSERT IGNORE INTO seats (county_id, category_id, product_id, agent_id, status) VALUES
  (1,  1, 1,  10, 'active'), -- Autauga, AL      | COMMERCIAL | BOP -> Ashley Taylor
  (13, 2, 12, 2,  'active'), -- Los Angeles, CA  | HEALTH     | Individual Health -> Jane Smith
  (28, 3, 22, 3,  'active'), -- Miami-Dade, FL    | PERSONAL   | Homeowners Insurance -> Robert Johnson
  (42, 4, 32, 4,  'active'), -- Cook, IL          | MEDICARE   | Medicare Supplement (Medigap) -> Emily Brown
  (81, 5, 40, 5,  'active'); -- New York (Manhattan), NY | FINANCIAL | Indexed Universal Life -> Michael Wilson
