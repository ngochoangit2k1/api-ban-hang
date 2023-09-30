import express from "express";
// import {isAuthenticated} from '../../middleware/permission';
import {
  signIn,
  registerUserEmail,
  getAccountInfo,
  updatePassword,
} from "../../services/users/auth.service.js";
import {
  loginValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../../validator/auth.validator.js";
import HttpStatusCode from "../../errors/HttpStatusCode.js";
import { FIELD_ERROR } from "../../errors/error.js";
import checkToken from "../../authentication/auth.authentication.js";

const auth = express.Router();

auth.get("/information",checkToken,  (req, res, next) => {
  return getAccountInfo(req.user.data)
    .then((resp) => res.status(200).json(resp))
    .catch(next);
});

auth.post("/sign-in", loginValidator, async (req, res, next) => {
  return signIn(req.body)
    .then((resp) => res.status(HttpStatusCode.OK).json(resp))
    .catch(next);
});

auth.post("/register", registerUserValidator, async (req, res, next) => {
  return registerUserEmail(req.body)
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

auth.post(
  "/forgot-password/reset",
  resetPasswordValidator,
  (req, res, next) => {
    return updatePassword(req.body)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(next);
  }
);

export function initWebAuthController(app) {
  app.use("/api/user/auth", auth);
}
