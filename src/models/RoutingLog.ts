import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import Lead from "./Lead";

export interface RoutingLogAttributes {
  id: number;
  lead_id: string; // UUID
  event: string;
  payload?: any;
  status: "success" | "failure" | "retry";
  latency_ms?: number;
  error_msg?: string | null;
  created_at?: Date;
}

export interface RoutingLogCreationAttributes extends Optional<
  RoutingLogAttributes,
  "id" | "payload" | "status" | "latency_ms" | "error_msg"
> {}

class RoutingLog
  extends Model<RoutingLogAttributes, RoutingLogCreationAttributes>
  implements RoutingLogAttributes
{
  public id!: number;
  public lead_id!: string;
  public event!: string;
  public payload?: any;
  public status!: "success" | "failure" | "retry";
  public latency_ms?: number;
  public error_msg?: string | null;

  public readonly created_at!: Date;
}

RoutingLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    lead_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    event: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("success", "failure", "retry"),
      defaultValue: "success",
    },
    latency_ms: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    error_msg: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "RoutingLog",
    tableName: "routing_logs",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Define relations
RoutingLog.belongsTo(Lead, { foreignKey: "lead_id" });
Lead.hasMany(RoutingLog, { foreignKey: "lead_id", as: "logs" });

export default RoutingLog;
