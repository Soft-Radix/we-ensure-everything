-- WeInsureEverything / AgentPro! + ReferralPro! Database Schema
-- MySQL

CREATE DATABASE IF NOT EXISTS weinsure_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE weinsure_dev;

-- ─────────────────────────────────────────────
-- 1. COUNTIES (3,143 U.S. Counties)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS counties (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fips_code VARCHAR(5)   NOT NULL UNIQUE COMMENT 'FIPS 5-digit code',
  name      VARCHAR(100) NOT NULL,
  state     VARCHAR(50)  NOT NULL,
  state_abbr CHAR(2)     NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_state (state_abbr),
  INDEX idx_name  (name)
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
  ('COMMERCIAL', 'Commercial Insurance',   'Comprehensive coverage for businesses of all sizes',      '/icons/commercial.png', 1),
  ('HEALTH',     'Health, Life & Disability','Individual and group health, life, and disability',     '/icons/health.png',     2),
  ('PERSONAL',   'Personal Insurance',     'Auto, home, and personal lines coverage',                '/icons/personal.png',   3),
  ('MEDICARE',   'Medicare & Senior',      'Medicare supplements and senior care solutions',          '/icons/senior.png',     4),
  ('FINANCIAL',  'Financial & Legal',      'Financial protection and legal expense coverage',         '/icons/legal.png',      5),
  ('GROUP',      'Group Benefits',         'Employee benefits and group administration',              '/icons/group.png',      6);

-- ─────────────────────────────────────────────
-- 10. SEED: Products
-- ─────────────────────────────────────────────
INSERT IGNORE INTO products (category_id, code, name, sort_order)
SELECT c.id, p.code, p.name, p.sort_order FROM categories c
JOIN (
  SELECT 'COMMERCIAL' AS cat, 'BOP'      AS code, 'Business Owners Policy (BOP)'             AS name, 1  AS sort_order UNION ALL
  SELECT 'COMMERCIAL', 'GL',         'General Liability',                                             2  UNION ALL
  SELECT 'COMMERCIAL', 'WC',         'Workers\' Compensation',                                         3  UNION ALL
  SELECT 'COMMERCIAL', 'COMM_AUTO',  'Commercial Auto',                                               4  UNION ALL
  SELECT 'COMMERCIAL', 'PROP',       'Commercial Property',                                            5  UNION ALL
  SELECT 'COMMERCIAL', 'CYBER',      'Cyber Liability',                                               6  UNION ALL
  SELECT 'COMMERCIAL', 'EPLI',       'Employment Practices Liability',                                7  UNION ALL
  SELECT 'COMMERCIAL', 'PROF',       'Professional Liability / E&O',                                  8  UNION ALL
  SELECT 'COMMERCIAL', 'SURETY',     'Surety Bonds',                                                  9  UNION ALL
  SELECT 'COMMERCIAL', 'MARINE',     'Inland Marine',                                                10  UNION ALL
  SELECT 'COMMERCIAL', 'EXCESS',     'Excess & Umbrella',                                            11  UNION ALL
  SELECT 'HEALTH', 'IND_HEALTH',     'Individual Health',                                             1  UNION ALL
  SELECT 'HEALTH', 'HEALTH_1099',    'Health for Independent Contractors & 1099s',                    2  UNION ALL
  SELECT 'HEALTH', 'LIFE',           'Life Insurance',                                                3  UNION ALL
  SELECT 'HEALTH', 'DISABILITY',     'Disability Insurance',                                          4  UNION ALL
  SELECT 'HEALTH', 'LTC',            'Long-Term Care (LTC)',                                          5  UNION ALL
  SELECT 'HEALTH', 'ANNUITIES',      'Annuities',                                                     6  UNION ALL
  SELECT 'HEALTH', 'DENTAL',         'Dental & Vision',                                               7  UNION ALL
  SELECT 'HEALTH', 'CRITICAL',       'Critical Illness',                                              8  UNION ALL
  SELECT 'HEALTH', 'ACCIDENT',       'Accident Insurance',                                            9  UNION ALL
  SELECT 'HEALTH', 'HOSPITAL',       'Hospital Indemnity',                                           10  UNION ALL
  SELECT 'PERSONAL', 'HOME',         'Homeowners Insurance',                                          1  UNION ALL
  SELECT 'PERSONAL', 'AUTO',         'Personal Auto',                                                 2  UNION ALL
  SELECT 'PERSONAL', 'RENTERS',      'Renters Insurance',                                             3  UNION ALL
  SELECT 'PERSONAL', 'UMBRELLA',     'Personal Umbrella',                                             4  UNION ALL
  SELECT 'PERSONAL', 'BOAT',         'Boat & Watercraft',                                             5  UNION ALL
  SELECT 'PERSONAL', 'RV',           'RV & Motorsports',                                              6  UNION ALL
  SELECT 'PERSONAL', 'CONDO',        'Condo Insurance',                                               7  UNION ALL
  SELECT 'PERSONAL', 'FLOOD',        'Flood Insurance',                                               8  UNION ALL
  SELECT 'PERSONAL', 'EARTHQUAKE',   'Earthquake Insurance',                                          9  UNION ALL
  SELECT 'PERSONAL', 'JEWELRY',      'Jewelry & Valuables',                                          10  UNION ALL
  SELECT 'MEDICARE', 'MED_SUPP',     'Medicare Supplement (Medigap)',                                 1  UNION ALL
  SELECT 'MEDICARE', 'MED_ADV',      'Medicare Advantage (Part C)',                                   2  UNION ALL
  SELECT 'MEDICARE', 'PART_D',       'Medicare Part D (Prescription)',                                3  UNION ALL
  SELECT 'MEDICARE', 'FINAL_EXP',    'Final Expense / Burial Insurance',                              4  UNION ALL
  SELECT 'MEDICARE', 'SNP',          'Special Needs Plans (SNP)',                                     5  UNION ALL
  SELECT 'MEDICARE', 'DSNP',         'Dual Eligible SNP (D-SNP)',                                     6  UNION ALL
  SELECT 'MEDICARE', 'NURSING',      'Nursing Home / Facility Care',                                  7  UNION ALL
  SELECT 'MEDICARE', 'HOME_CARE',    'Home Health Care Coverage',                                     8  UNION ALL
  SELECT 'FINANCIAL', 'IUL',         'Indexed Universal Life (IUL)',                                  1  UNION ALL
  SELECT 'FINANCIAL', 'WHOLE',       'Whole Life Insurance',                                          2  UNION ALL
  SELECT 'FINANCIAL', 'TERM',        'Term Life Insurance',                                           3  UNION ALL
  SELECT 'FINANCIAL', 'FIXED_ANN',   'Fixed Annuities',                                              4  UNION ALL
  SELECT 'FINANCIAL', 'VARIABLE',    'Variable Annuities',                                            5  UNION ALL
  SELECT 'FINANCIAL', 'LEGAL',       'Legal Expense Insurance',                                       6  UNION ALL
  SELECT 'FINANCIAL', 'ID_THEFT',    'Identity Theft Protection',                                     7  UNION ALL
  SELECT 'FINANCIAL', '401K',        '401(k) Rollover / IRA',                                        8  UNION ALL
  SELECT 'FINANCIAL', 'WEALTH',      'Wealth Management & Protection',                                9  UNION ALL
  SELECT 'GROUP', 'GROUP_HEALTH',    'Group Health Insurance',                                        1  UNION ALL
  SELECT 'GROUP', 'GROUP_LIFE',      'Group Life Insurance',                                          2  UNION ALL
  SELECT 'GROUP', 'GROUP_DENTAL',    'Group Dental & Vision',                                         3  UNION ALL
  SELECT 'GROUP', 'GROUP_DIS',       'Group Disability Insurance',                                    4  UNION ALL
  SELECT 'GROUP', 'GROUP_401K',      'Group 401(k) Plans',                                            5  UNION ALL
  SELECT 'GROUP', 'HRA',             'Health Reimbursement Arrangements (HRA)',                       6  UNION ALL
  SELECT 'GROUP', 'HSA',             'Health Savings Accounts (HSA)',                                 7  UNION ALL
  SELECT 'GROUP', 'FSA',             'Flexible Spending Accounts (FSA)',                              8  UNION ALL
  SELECT 'GROUP', 'COBRA',           'COBRA Administration',                                          9  UNION ALL
  SELECT 'GROUP', 'WELLNESS',        'Employee Wellness Programs',                                   10  UNION ALL
  SELECT 'GROUP', 'VOLUNTARY',       'Voluntary Benefits',                                           11
) p ON c.code = p.cat;

-- ─────────────────────────────────────────────
-- 11. SEED: Agents
-- ─────────────────────────────────────────────
INSERT IGNORE INTO agents (ghl_user_id, full_name, email, phone, license_no, license_state, bio, status) VALUES
  ('user_101', 'John Doe', 'john.doe@agentpro.com', '(555) 123-4567', 'LIC-98765', 'CA', 'Commercial insurance specialist with 15+ years of experience helping businesses mitigate risk.', 'active'),
  ('user_102', 'Jane Smith', 'jane.smith@agentpro.com', '(555) 234-5678', 'LIC-87654', 'NY', 'Dedicated to providing comprehensive health and life insurance solutions for families and individuals.', 'active'),
  ('user_103', 'Robert Johnson', 'robert.j@agentpro.com', '(555) 345-6789', 'LIC-76543', 'TX', 'Expert in personal lines, ensuring your home and auto are protected with the best coverage options.', 'active'),
  ('user_104', 'Emily Brown', 'emily.brown@agentpro.com', '(555) 456-7890', 'LIC-65432', 'FL', 'Specializing in Medicare Advantage and Supplement plans for over a decade.', 'active'),
  ('user_105', 'Michael Wilson', 'm.wilson@agentpro.com', '(555) 567-8901', 'LIC-54321', 'IL', 'Helping clients navigate complex financial and legal protection strategies.', 'active'),
  ('user_110', 'Sarah Davis', 'sarah.davis@agentpro.com', '(555) 678-9012', 'LIC-43210', 'GA', 'Group benefits expert focusing on employee retention through superior benefits packages.', 'active'),
  ('user_111', 'David Garcia', 'dave.garcia@agentpro.com', '(555) 789-0123', 'LIC-32109', 'AZ', 'Passionate about finding the right auto and property solutions for my community.', 'active'),
  ('user_112', 'Jessica Martinez', 'jessica.m@agentpro.com', '(555) 890-1234', 'LIC-21098', 'WA', 'Focused on luxury home and specialized umbrella policies for high-net-worth clients.', 'active'),
  ('user_109', 'William Anderson', 'william.a@agentpro.com', '(555) 901-2345', 'LIC-10987', 'OH', 'Providing peace of mind through tailored life and long-term care insurance.', 'active'),
  ('user_113', 'Ashley Taylor', 'ashley.t@agentpro.com', '(555) 012-3456', 'LIC-09876', 'NC', 'Expert in business owners policies and general liability for startups.', 'active');

-- ─────────────────────────────────────────────
-- 12. SEED: Initial Seats (Exclusives)
-- ─────────────────────────────────────────────
INSERT IGNORE INTO seats (county_id, category_id, product_id, agent_id, status) VALUES
  (1,  1, 1,  10, 'active'), -- Autauga, AL      | COMMERCIAL | BOP -> Ashley Taylor
  (13, 2, 12, 2,  'active'), -- Los Angeles, CA  | HEALTH     | Individual Health -> Jane Smith
  (28, 3, 22, 3,  'active'), -- Miami-Dade, FL    | PERSONAL   | Homeowners Insurance -> Robert Johnson
  (42, 4, 32, 4,  'active'), -- Cook, IL          | MEDICARE   | Medicare Supplement (Medigap) -> Emily Brown
  (81, 5, 40, 5,  'active'); -- New York (Manhattan), NY | FINANCIAL | Indexed Universal Life -> Michael Wilson
