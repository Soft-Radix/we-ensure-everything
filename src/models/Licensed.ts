import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import County from "./County";
import Category from "./Category";
import Product from "./Product";
import Agent from "./Agent";

export interface LicensedAttributes {
  id: number;
  county_id: number;
  category_id: number;
  product_id: number;
  agent_id: number;
  status: "active" | "inactive";
}

export interface LicensedCreationAttributes extends Optional<
  LicensedAttributes,
  "id" | "status"
> {}

class Licensed
  extends Model<LicensedAttributes, LicensedCreationAttributes>
  implements LicensedAttributes
{
  public id!: number;
  public county_id!: number;
  public category_id!: number;
  public product_id!: number;
  public agent_id!: number;
  public status!: "active" | "inactive";
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Licensed.init(
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
  },
  {
    sequelize,
    modelName: "Licensed",
    tableName: "licensed_in",
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
Licensed.belongsTo(County, { foreignKey: "county_id" });
Licensed.belongsTo(Category, { foreignKey: "category_id" });
Licensed.belongsTo(Product, { foreignKey: "product_id" });
Licensed.belongsTo(Agent, { foreignKey: "agent_id" });

Agent.hasMany(Licensed, { foreignKey: "agent_id", as: "licensed_in" });

export default Licensed;
