import models from "../models";
import httpStatus from "http-status";
import createError from "http-errors";
import { userTable, FriendTable } from "../databases";
import response from "../utils/response";

const User = new userTable();

const get = async (req, res, next) => {
  try {
    if (req.params.id) {
      const user = await User.find(req.params.id);

      if (!user) {
        throw createError(httpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
      }

      return res.status(httpStatus.OK).json(user);
    } else {
      const users = await User.all();

      return res.json(users);
    }
  } catch (e) {
    next(e);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.id) {
      const users = await User.all(req.user.id);
      return response(res, { users });
    } else {
      throw createError(httpStatus.FORBIDDEN, "권한이 없습니다.");
    }
  } catch (e) {
    next(e);
  }
};

export { get, getAllUsers };
