import express from "express";
// import {isAuthenticated} from '../../middleware/permission';
import {
  signIn,
  registerUserEmail,
} from "../../services/users/auth.service.js";
import { loginValidator } from "../../validator/auth.validator.js";
import {
  updateUserProfileValidator,
  setLevelUserValidator,
} from "../../validator/user.validator.js";
import {
  getListUser,
  getUserDetail,
  updateUserProfile,
  updateLevelUser,
} from "../../services/users/user.service.js";
import HttpStatusCode from "../../errors/HttpStatusCode.js";
import { pagingParse } from "../../middleware/paging.middleware.js";

const user = express.Router();

user.get(
  "/",
  [pagingParse({ column: "id", dir: "desc" })],

  (req, res, next) => {
    console.log("req.query", req.paging)
    return getListUser(req.query, req.paging)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);
user.get("/detail/:userId", (req, res, next) => {
  return getUserDetail(req.params.userId)
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

user.put(
  "/update-user-profile",
  updateUserProfileValidator,
  (req, res, next) => {
    return updateUserProfile(req.user.data, req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

user.get("/id", (req, res) => {
  // console.log(req.user)
  res.send("Get detail user by id " + req?.user.data.id); // req? vẫn cho null
});

user.put("/set-level-user/level", [setLevelUserValidator], (req, res, next) => {
  return updateLevelUser(req.body)
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

export function initWebUserController(app) {
  app.use("/api/user/user-info", user);
}
