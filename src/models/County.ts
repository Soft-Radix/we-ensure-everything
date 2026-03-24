import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export interface CountyAttributes {
  id: number;
  fips_code: string;
  name: string;
  state: string;
  state_abbr: string;
}

export interface CountyCreationAttributes extends Optional<
  CountyAttributes,
  "id"
> {}

class County
  extends Model<CountyAttributes, CountyCreationAttributes>
  implements CountyAttributes
{
  public id!: number;
  public fips_code!: string;
  public name!: string;
  public state!: string;
  public state_abbr!: string;

  public readonly created_at!: Date;
}

County.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fips_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state_abbr: {
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "County",
    tableName: "counties",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default County;
