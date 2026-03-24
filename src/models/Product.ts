import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import Category from "./Category";

export interface ProductAttributes {
  id: number;
  category_id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number;
  active?: boolean;
}

export interface ProductCreationAttributes extends Optional<
  ProductAttributes,
  "id" | "description" | "sort_order" | "active"
> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public category_id!: number;
  public code!: string;
  public name!: string;
  public description?: string | null;
  public sort_order!: number;
  public active!: boolean;

  public readonly created_at!: Date;
  public readonly Category?: Category;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["category_id", "code"],
      },
    ],
  },
);

// Define relations
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id" });

export default Product;
