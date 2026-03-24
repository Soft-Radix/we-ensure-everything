import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import County from "./County";
import Category from "./Category";
import Product from "./Product";
import Agent from "./Agent";

export interface LeadAttributes {
  id: string; // UUID
  county_id: number;
  category_id: number;
  product_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  assigned_agent_id?: number | null;
  routing_status: "assigned" | "no_agent" | "waitlisted" | "error";
  ghl_contact_id?: string | null;
  ghl_pipeline_id?: string | null;
  idempotency_key?: string | null;
  source?: string | null;
  ip_address?: string | null;
  routed_at?: Date | null;
}

export interface LeadCreationAttributes extends Optional<
  LeadAttributes,
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "assigned_agent_id"
  | "ghl_contact_id"
  | "ghl_pipeline_id"
  | "idempotency_key"
  | "source"
  | "ip_address"
  | "routed_at"
> {}

class Lead
  extends Model<LeadAttributes, LeadCreationAttributes>
  implements LeadAttributes
{
  public id!: string;
  public county_id!: number;
  public category_id!: number;
  public product_id!: number;
  public first_name?: string | null;
  public last_name?: string | null;
  public email?: string | null;
  public phone?: string | null;
  public assigned_agent_id?: number | null;
  public routing_status!: "assigned" | "no_agent" | "waitlisted" | "error";
  public ghl_contact_id?: string | null;
  public ghl_pipeline_id?: string | null;
  public idempotency_key?: string | null;
  public source?: string | null;
  public ip_address?: string | null;
  public routed_at?: Date | null;

  public readonly created_at!: Date;
}

Lead.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
    },
    county_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    assigned_agent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    routing_status: {
      type: DataTypes.ENUM("assigned", "no_agent", "waitlisted", "error"),
      allowNull: false,
    },
    ghl_contact_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ghl_pipeline_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    idempotency_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: "website",
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    routed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Lead",
    tableName: "leads",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Define relations
Lead.belongsTo(County, { foreignKey: "county_id" });
Lead.belongsTo(Category, { foreignKey: "category_id" });
Lead.belongsTo(Product, { foreignKey: "product_id" });
Lead.belongsTo(Agent, { foreignKey: "assigned_agent_id" });

export default Lead;
