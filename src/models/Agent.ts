import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export interface AgentAttributes {
  id: number;
  ghl_user_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  license_no?: string | null;
  license_state?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  website_url?: string | null;
  status: "active" | "inactive" | "suspended";
  created_at?: Date;
  updated_at?: Date;
}

export interface AgentCreationAttributes extends Optional<
  AgentAttributes,
  "id" | "status" | "created_at" | "updated_at"
> {}

class Agent
  extends Model<AgentAttributes, AgentCreationAttributes>
  implements AgentAttributes
{
  public id!: number;
  public ghl_user_id?: string | null;
  public full_name!: string;
  public email!: string;
  public phone!: string;
  public license_no?: string | null;
  public license_state?: string | null;
  public bio?: string | null;
  public photo_url?: string | null;
  public website_url?: string | null;
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
