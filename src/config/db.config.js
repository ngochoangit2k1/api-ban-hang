import mongoose from "mongoose";
import { print, OutputType } from "../../helpers/prints.js";
import Exception from "../errors/Exception.js";

mongoose.set("strictQuery", true);
const connectDatabase = async () => {
  const mongoDbUrl = `${process.env.MONGODB_URL}`;
  print(`Conneting to ${mongoDbUrl}`, OutputType.SUCCESS);

  // mongoose.Promise = global.Promise;

  await mongoose
    .connect(mongoDbUrl)
    .then(() => {
      console.log("Successfuly conneted to the database");
    })
    .catch((err) => {
      const { code } = err;
      if (err.code === 8000) {
        throw new Exception("Wrong database 's username and password");
      }

      throw new Exception("Cannot connect to Database");
    });
};

export default connectDatabase;
