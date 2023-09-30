import { print, OutputType } from "../../../helpers/prints.js";
import Auth from "../../db/models/auth.model.js";
import db from "../../db/models/index.js";
import Exception from "../../errors/Exception.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkUserExisted } from "./otp.service.js";
import { USER_STATUS, USER_CODE } from "../../db/models/user/user.js";
import { getNextUserCode } from "../../utils/allCode.utils.js";
import { FIELD_ERROR, badRequest } from "../../errors/error.js";
import { checkOtpCode, deleteOtpCode } from "./otp.service.js";
import { OTP_CODE_TYPE, ROLE } from "../../constants/common.constant.js";

export async function getAccountInfo(user) {
  try {
    const accountInfo = await db.User.findOne({
      where: {
        id: user.id,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.UserInformation,
          as: "userInformation",
        },
        {
          model: db.UserAddress,
          as: "userAddress",
        },
        {
          model: db.UserReferral,
          as: "userReferral",
        },
      ],
    });

    if (!accountInfo) {
      throw badRequest(
        "get_user_info",
        FIELD_ERROR.USER_NOT_FOUND,
        "User not found"
      );
    }
    if (accountInfo.status !== USER_STATUS.ACTIVE) {
      throw badRequest(
        "get_user_info",
        FIELD_ERROR.USER_NOT_ACTIVE,
        "User not active."
      );
    }

    return { ...accountInfo.toJSON() };
  } catch (e) {
    console.log("ERROR_GET_ACCOUNT_INFO: ", e);
    throw e;
  }
}
export async function signIn({ email, password }) {
  const model = db.User;
  if (!email || email.length === 0 || !password || password.length === 0) {
    throw new badRequest(
      "credential",
      FIELD_ERROR.EMAIL_OR_PASSWORD_INVALID,
      "Email or password invalid."
    );
  }
  const user = await model.findOne({
    where: { email },
  });
  // console.log(user);
  if (user /*check not null*/) {
    await bcrypt.compare(user.password, password);

    const isMatched = await bcrypt.compare(password, user.password);

    if (isMatched) {
      let token = jwt.sign(
        { data: user },
        process.env.JWTPrivateKey,
        { expiresIn: "10 days" } //thời gian tồn tại của token
      );
      const userJson = { ...user.toJSON() };
      //clone add more properties
      await db.UserInformation.update(
        { lastLogin: new Date() },
        {
          where: {
            userId: user.id,
          },
        }
      );
      return {
        user: userJson,

        token: token,
      };
    } else {
      throw badRequest(
        "credential",
        FIELD_ERROR.WRONG_PASSWORD,
        "Wrong password"
      );
    }
  } else {
    throw badRequest(
      "credential",
      FIELD_ERROR.USER_NOT_FOUND,
      "User not found"
    );
  }
}

export async function registerUserEmail(registerForm) {
  await checkUserExisted(
    registerForm.email,
    registerForm.phoneCode,
    registerForm.phoneNumber,
    registerForm.username
  );

  // check user referral
  let userRef;
  if (registerForm.referralCode) {
    const refType = registerForm.referralCode.trim().replace(/\d+/g, "");
    if (![USER_CODE].includes(refType)) {
      throw badRequest(
        "register-user-email",
        FIELD_ERROR.REFERRAL_CODE_INVALID,
        "Referral code invalid"
      );
    }
    userRef = await db.User.findOne({
      where: {
        userCode: registerForm.referralCode,
      },
    });

    if (!userRef) {
      throw badRequest(
        "register-user-email",
        FIELD_ERROR.REFERRER_NOT_EXIST_OR_NOT_ACTIVE_EMAIL,
        "Referrer does not exist or has not activated email"
      );
    }
  }

  const passwordHash = db.User.hashPassword(registerForm.password);
  const t = await db.sequelize.transaction();

  try {
    const referrerCode =
      registerForm.referralCode && registerForm.referralCode.trim();
    const userCode = await getNextUserCode(db.User);
    
    const newUser = await db.User.create(
      {
        userCode: `${USER_CODE}${userCode}`,
        email: registerForm.email,
        username: registerForm.username,
        password: passwordHash,
        status: USER_STATUS.ACTIVE,
        level: 0,
        role: 3,
        userInformation: {
          fullName: registerForm.fullName,
        },
      },
      {
        include: [
          {
            model: db.UserInformation,
            as: "userInformation",
          },
        ],
        transaction: t,
      }
    );

    if (userRef) {
      const genealogyPath = await getGenealogyPath(userRef.id);

      await db.UserReferral.create(
        {
          registerCode: `${USER_CODE}${userCode}`,
          registerId: newUser.id,
          referrerCode,
          referrerId: userRef.id,
          genealogyPath: genealogyPath
            ? `${genealogyPath}.${newUser.id}`
            : `${userRef.id}.${newUser.id}`,
        },
        {
          transaction: t,
        }
      );
    }

    await t.commit();

    return true;
  } catch (e) {
    if (t) await t.rollback();
    throw e;
  }
}

export async function updatePassword({ email, password, rePassword, otpCode }) {
  // check otp code
  console.log("test", email, password, rePassword, otpCode);
  await checkOtpCode({ email, type: OTP_CODE_TYPE.FORGOT_PASSWORD, otpCode });

  if (password !== rePassword) {
    throw badRequest(
      "password",
      FIELD_ERROR.PASSWORD_NOT_MATCH,
      "Password is not match with re password."
    );
  }

  const user = await db.User.findOne({ where: { email } });

  if (!user) {
    throw badRequest(
      "update-password",
      FIELD_ERROR.ACCOUNT_NOT_FOUND,
      "Email not found"
    );
  }

  const model = db.User;

  const passwordHash = model.hashPassword(password);
  await model.update(
    {
      password: passwordHash,
    },
    {
      where: { email },
    }
  );

  await deleteOtpCode({ email, type: OTP_CODE_TYPE.FORGOT_PASSWORD });

  return true;
}
