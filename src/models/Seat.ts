import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import County from "./County";
import Category from "./Category";
import Product from "./Product";
import Agent from "./Agent";

export interface SeatAttributes {
  id: number;
  county_id: number;
  category_id: number;
  product_id: number;
  agent_id: number;
  status: "active" | "inactive";
  assigned_at?: Date;
  expires_at?: Date | null;
}

export interface SeatCreationAttributes extends Optional<
  SeatAttributes,
  "id" | "status" | "assigned_at" | "expires_at"
> {}

class Seat
  extends Model<SeatAttributes, SeatCreationAttributes>
  implements SeatAttributes
{
  public id!: number;
  public county_id!: number;
  public category_id!: number;
  public product_id!: number;
  public agent_id!: number;
  public status!: "active" | "inactive";
  public assigned_at!: Date;
  public expires_at?: Date | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Seat.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
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
    agent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Seat",
    tableName: "seats",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["county_id", "category_id", "product_id"],
      },
    ],
  },
);

// Define relations
Seat.belongsTo(County, { foreignKey: "county_id" });
Seat.belongsTo(Category, { foreignKey: "category_id" });
Seat.belongsTo(Product, { foreignKey: "product_id" });
Seat.belongsTo(Agent, { foreignKey: "agent_id" });

Agent.hasMany(Seat, { foreignKey: "agent_id", as: "seats" });

export default Seat;
