import sequelize from "../lib/sequelize";
import Agent from "./Agent";
import Category from "./Category";
import Product from "./Product";
import County from "./County";
import State from "./State";
import Seat from "./Seat";
import Waitlist from "./Waitlist";
import Lead from "./Lead";
import RoutingLog from "./RoutingLog";
import User from "./User";
import Licensed from "./Licensed";
import Payment from "./Payment";

const models = {
  Agent,
  Category,
  Product,
  County,
  State,
  Seat,
  Waitlist,
  Lead,
  RoutingLog,
  User,
  Licensed,
  Payment,
};

// If there are any additional associations that need to be defined in a specific order, do it here.

export {
  sequelize,
  Agent,
  Category,
  Product,
  County,
  State,
  Seat,
  Waitlist,
  Lead,
  RoutingLog,
  User,
  Licensed,
  Payment,
};

export default models;
