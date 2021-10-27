import createError from "http-errors";
import jwt from "jsonwebtoken";
import { userTable } from "../databases";

const User = new userTable();
export default async (req, res, next) => {
  try {
    let id = id;
    req.user = null;
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization.split("Bearer ")[1],
        process.env.JWT_SECRET,
        (err, payload) => {
          if (err) {
            console.log(err);
            return next(createError(401, "토큰 정보가 유효하지 않습니다."));
          }

          id = payload.id;
        }
      );

      const user = await User.find(id);

      if (!user) {
        return next(createError(404, "사용자를 찾을 수 없습니다."));
      }
      req.user = user;
    }

    console.log("hi");
    next();
  } catch (e) {
    next(e);
  }
};
