// import Auth from './auth.model.js'
// import User from './user.model.js'
import Sequelize from "sequelize";
import databaseConfig from "../../config/database.config.js";
import User from "./user/user.js";
import UserInformation from "./user/user-information.js";
import UserAddress from "./user/user-address.js";
import UserReferral from "./user/user-referral.js";
import UserBonus from "./user/user-bonus.js";
import Product from "./product/product.js";
import ProductInventory from "./product/product-inventory.js";
import ProductImage from "./product/product-image.js";
import ProductCategory from "./product/product-category.js";
import ProductDetail from "./product/product-detail.js";
import Discount from "./product/discount.js";
import Order from "./order/order.js";
import OrderPayment from "./order/orderPayment.js";
import OrderItem from "./order/orderItem.js";
import CommissionConfig from "./commission-config.js";
import CommissionLevel from "./commission-level.js";
import OTP from "./otp.js";
import dotenv from "dotenv";

dotenv.config();

const env = "local" || "development";

const config = {
  ...databaseConfig[env],
};

const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  config
);
const models = {
  // User
  User: User.init(sequelize),
  UserInformation: UserInformation.init(sequelize),
  UserAddress: UserAddress.init(sequelize),
  UserReferral: UserReferral.init(sequelize),
  UserBonus: UserBonus.init(sequelize),
  OTP: OTP.init(sequelize),
  // Product
  Product: Product.init(sequelize),
  ProductDetail: ProductDetail.init(sequelize),
  ProductInventory: ProductInventory.init(sequelize),
  ProductImage: ProductImage.init(sequelize),
  ProductCategory: ProductCategory.init(sequelize),
  Discount: Discount.init(sequelize),

  // Order
  Order: Order.init(sequelize),
  OrderPayment: OrderPayment.init(sequelize),
  OrderItem: OrderItem.init(sequelize),

  // Master
  CommissionConfig: CommissionConfig.init(sequelize),
  CommissionLevel: CommissionLevel.init(sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
