import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export interface StateAttributes {
  id: number;
  code: string;
  name: string;
  active?: boolean;
}

export interface StateCreationAttributes extends Optional<
  StateAttributes,
  "id" | "active"
> {}

class State
  extends Model<StateAttributes, StateCreationAttributes>
  implements StateAttributes
{
  public id!: number;
  public code!: string;
  public name!: string;
  public active!: boolean;

  public readonly created_at!: Date;
}

State.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "State",
    tableName: "states",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default State;
