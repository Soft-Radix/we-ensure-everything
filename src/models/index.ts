import sequelize from "../lib/sequelize";
import Agent from "./Agent";
import Category from "./Category";
import Product from "./Product";
import County from "./County";
import Seat from "./Seat";
import Waitlist from "./Waitlist";
import Lead from "./Lead";
import RoutingLog from "./RoutingLog";

const models = {
  Agent,
  Category,
  Product,
  County,
  Seat,
  Waitlist,
  Lead,
  RoutingLog,
};

// If there are any additional associations that need to be defined in a specific order, do it here.

export {
  sequelize,
  Agent,
  Category,
  Product,
  County,
  Seat,
  Waitlist,
  Lead,
  RoutingLog,
};

export default models;
