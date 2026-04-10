import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";
import Agent from "./Agent";
import { PlanType } from "../lib/enum";

export interface PaymentAttributes {
  id: number;
  agent_id: number;
  ghl_payment_id?: string | null;
  amount?: number | null;
  currency?: string | null;
  plan_type: PlanType;
  status: string;
  payload?: Record<string, unknown> | null;
  created_at?: Date;
}

export type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  "id" | "ghl_payment_id" | "amount" | "currency" | "payload" | "created_at"
>;

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public agent_id!: number;
  public ghl_payment_id?: string | null;
  public amount?: number | null;
  public currency?: string | null;
  public plan_type!: PlanType;
  public status!: string;
  public payload?: Record<string, unknown> | null;

  public readonly created_at!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    agent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    ghl_payment_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "USD",
    },
    plan_type: {
      type: DataTypes.ENUM(...Object.values(PlanType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "success",
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Define relations
Payment.belongsTo(Agent, { foreignKey: "agent_id" });
Agent.hasMany(Payment, { foreignKey: "agent_id", as: "payments" });

export default Payment;
