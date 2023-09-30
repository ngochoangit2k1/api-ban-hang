import { initWebAuthController } from "./users/auth.controllers.js";
import { initWebUserController } from "./users/users.controllers.js";
import {initWebProductController} from "./product.controller.js"
import { initWebOrderController } from './order.controller.js';
import { initOtpController } from './users/otp.controller.js';
export function initApiController(app) {
  initWebAuthController(app);
  initWebUserController(app);
  initWebProductController(app);
  initWebOrderController(app);
  initOtpController(app)
}
