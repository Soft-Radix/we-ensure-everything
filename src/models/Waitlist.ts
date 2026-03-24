import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import County from "./County";
import Category from "./Category";
import Product from "./Product";
import Agent from "./Agent";

export interface WaitlistAttributes {
  id: number;
  county_id: number;
  category_id: number;
  product_id: number;
  agent_id: number;
  position: number;
  status: "waiting" | "promoted" | "cancelled";
  notified_at?: Date | null;
}

export interface WaitlistCreationAttributes extends Optional<
  WaitlistAttributes,
  "id" | "position" | "status" | "notified_at"
> {}

class Waitlist
  extends Model<WaitlistAttributes, WaitlistCreationAttributes>
  implements WaitlistAttributes
{
  public id!: number;
  public county_id!: number;
  public category_id!: number;
  public product_id!: number;
  public agent_id!: number;
  public position!: number;
  public status!: "waiting" | "promoted" | "cancelled";
  public notified_at?: Date | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Waitlist.init(
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
    position: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM("waiting", "promoted", "cancelled"),
      defaultValue: "waiting",
    },
    notified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Waitlist",
    tableName: "waitlist",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Define relations
Waitlist.belongsTo(County, { foreignKey: "county_id" });
Waitlist.belongsTo(Category, { foreignKey: "category_id" });
Waitlist.belongsTo(Product, { foreignKey: "product_id" });
Waitlist.belongsTo(Agent, { foreignKey: "agent_id" });

Agent.hasMany(Waitlist, { foreignKey: "agent_id", as: "waitlist_entries" });

export default Waitlist;
