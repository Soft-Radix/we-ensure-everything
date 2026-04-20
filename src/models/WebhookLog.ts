import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export interface WebhookLogAttributes {
  id: number;
  source: string; // 'stripe', 'ghl', etc.
  event_type: string;
  payload: any;
  status: string; // 'received', 'processed', 'failed', 'ignored'
  error_message?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface WebhookLogCreationAttributes
  extends Optional<
    WebhookLogAttributes,
    "id" | "status" | "error_message" | "created_at" | "updated_at"
  > {}

class WebhookLog
  extends Model<WebhookLogAttributes, WebhookLogCreationAttributes>
  implements WebhookLogAttributes
{
  public id!: number;
  public source!: string;
  public event_type!: string;
  public payload!: any;
  public status!: string;
  public error_message?: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

WebhookLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    event_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "received",
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "WebhookLog",
    tableName: "webhook_logs",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default WebhookLog;
