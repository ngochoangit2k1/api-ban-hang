import HttpStatusCode from "../errors/HttpStatusCode.js";
import jwt from "jsonwebtoken";
import passport from "passport";
export default function checkToken(req, res, next) {
  // khi nào có next chức năng ms hoạt động
  // bỏ qua login và register
  // console.log(req.url);
  let a = true;
  if (
    req.url.toLowerCase().trim() ===
      "/api/user/auth/sign-in".toLowerCase().trim() ||
    req.url.toLowerCase().trim() ==
      " /api/user/auth/sign-up".toLowerCase().trim()
  ) {
    next();
    return;
  }
  const passportJWT = passport.authenticate("jwt", { session: false });
  const token = req.headers?.authorization?.split(" ")[1];

  try {
    const jwtObject = jwt.verify(token, process.env.JWTPrivateKey);
    const isExpired = Date.now() >= jwtObject.exp * 1000;
    if (isExpired) {
      res.results(HttpStatusCode.BAD_REQUEST).json({
        message: "Token is expired",
      });
      res.end();
    } else {
      console.log(Date.now());
      req.user = jwtObject;
      next();
    }

    debugger;
  } catch (exception) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Bạn chưa login",
    });
  }
  debugger;
}
