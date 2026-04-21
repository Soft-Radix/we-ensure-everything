import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import { PlanType } from "../lib/enum";

export interface AgentAttributes {
  id: number;
  ghl_user_id?: string | null;
  ghl_api_key?: string | null;
  full_name: string;
  email: string;
  phone: string;
  license_no?: string | null;
  license_state?: string | null;
  business_name?: string | null;
  business_website?: string | null;
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  district?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  website_url?: string | null;
  plan_type?: PlanType | null;
  ghl_location_id?: string | null;
  status: "active" | "inactive" | "suspended";
  created_at?: Date;
  updated_at?: Date;
}

export type AgentCreationAttributes = Optional<
  AgentAttributes,
  "id" | "status" | "created_at" | "updated_at"
>;

class Agent
  extends Model<AgentAttributes, AgentCreationAttributes>
  implements AgentAttributes
{
  public id!: number;
  public ghl_user_id?: string | null;
  public ghl_api_key?: string | null;
  public full_name!: string;
  public email!: string;
  public phone!: string;
  public license_no?: string | null;
  public license_state?: string | null;
  public business_name?: string | null;
  public business_website?: string | null;
  public street_address?: string | null;
  public city?: string | null;
  public state?: string | null;
  public country?: string | null;
  public postal_code?: string | null;
  public district?: string | null;
  public bio?: string | null;
  public photo_url?: string | null;
  public website_url?: string | null;
  public plan_type?: PlanType | null;
  public ghl_location_id?: string | null;
  public status!: "active" | "inactive" | "suspended";

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Agent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ghl_user_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    ghl_api_key: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    license_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    license_state: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    business_website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    street_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    website_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    plan_type: {
      type: DataTypes.ENUM(...Object.values(PlanType)),
      allowNull: true,
    },
    ghl_location_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Agent",
    tableName: "agents",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Agent;
