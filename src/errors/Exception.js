import { print, OutputType } from "../../helpers/prints.js";

export default class Exception extends Error {
  static WRONG_DB_USERNAME_PASSWORD = "Wrong database username and password";
  static WRONG_CONNECTION_STRING = "Wrong server name/connetion string";
  static CANNOT_CONNECT_MONGO = "Can not connect to mongoosee";
  static CANNOT_REGISTER_USER = "Can not register user";
  static USER_EXIT = "User already exists";
  static WRONG_EMAIL_AND_PASSWORD = "Wrong email or password incorrect";
  constructor(message) {
    super(message);
    print(message, OutputType.ERROR);
  }
}
