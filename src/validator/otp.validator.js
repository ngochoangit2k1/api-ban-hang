import joi from "joi";
import { OTP_CODE_TYPE } from "../constants/common.constant.js";
import { REGEX } from "../utils/regex.util.js";
import { validator, validatorType } from "./index.js";

export const sendOtpValidator = validator(
  joi.object().keys({
    email: joi.string().trim().email().regex(REGEX.email, "email").required(),
    type: joi
      .string()
      .valid(...Object.values(OTP_CODE_TYPE))
      .required(),
  }),
  validatorType.BODY
);
