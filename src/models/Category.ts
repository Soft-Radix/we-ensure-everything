import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export interface CategoryAttributes {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  active?: boolean;
}

export interface CategoryCreationAttributes extends Optional<
  CategoryAttributes,
  "id" | "description" | "icon" | "sort_order" | "active"
> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public code!: string;
  public name!: string;
  public description?: string | null;
  public icon?: string | null;
  public sort_order!: number;
  public active!: boolean;

  public readonly created_at!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(255),
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
    modelName: "Category",
    tableName: "categories",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default Category;
