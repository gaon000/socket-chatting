require("dotenv").config();

import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import response from "./utils/response";
import jwtMiddleware from "./middlewares/jwt.middleware";
import cors from "cors";
import io from "socket.io";
import { directSocket, groupSocket } from "./chat";

const app = express();

app.use(cors());
app.use(express.static("socket"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(jwtMiddleware);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  let apiError = err;

  if (!err.status) {
    apiError = createError(err);
  }

  res.locals.message = apiError.message;
  res.locals.error = process.env.NODE_ENV === "development" ? apiError : {};
  console.log(apiError);

  return response(
    res,
    {
      message: apiError.message,
    },
    apiError.status
  );
});

app.io = io({
  cors: {
    origin: "*",
  },
});

const dmNsp = app.io.of("/dm");
groupSocket(app.io);
directSocket(dmNsp);

// bin/www 를 그대로 사용하기 위해서 예외적으로 commonJs 문법을 적용
module.exports = app;
