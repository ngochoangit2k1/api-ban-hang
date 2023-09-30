import http from 'http';
import express from "express";
import morgan from "morgan";
import Helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./src/config/db.config.js";
import { initApiController } from "./src/controllers/index.js";
import bodyParser from 'body-parser';
import checkToken from "./src/authentication/auth.authentication.js";
import { appLog, httpStream } from './src/config/winston.js';
import appConf from './src/config/application.js';
import { FormError, isSystemError } from './src/errors/error.js';
dotenv.config();

const port = process.env.PORT ?? 8000;
const isProducion = process.env.NODE_ENV === "production";

const app = express();
app.use(cors());
// shield: khiên bảo vệ trước khi vào web
app.use(Helmet());
// app.use(checkToken);
// const accessLogStream = rfs("access.log",{
//     interval: "1d",
//     path: join(__dirname, "log")
// })
app.use(
  isProducion ? morgan("combined", { stream: accessLogStream }) : morgan("dev")
);
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public")); 

initApiController(app);

// app.use('/user', userRouter)
// app.use('/auth', authRouter)
// app.use('/api', require('./src/routes/router').default)
app.use((err, req, res, next) => {
  
  appLog.error(`message - ${err.message}, stack trace - ${err.stack}`);
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof FormError) {
    err.errors.code = (err.errors && err.errors.code && err.errors.code.message)|| err.errors.code || 'INVALID'; // If the code is an object type then just get message (Ex: INVALID)
    res.status(err.code || 400)
      .json(err.errors);
  } else if (!isSystemError(err)) {
    res.statusMessage = err.message;
    res.status(err.code || 500)
      .json({error: err.message});
  }
});

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

const server = http.createServer(app);
app.listen(port, async () => {
  await connectDatabase();
  const PORT = process.env.PORT || appConf.port;
  server.listen(PORT, appConf.hostname, async () => {
    appLog.info(`Server running at http://${appConf.hostname}:${PORT}/`);
  })
  console.log(`server listening on port: ${port}`);
});
