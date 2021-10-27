import httpStatus from "http-status";
import createError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userTable } from "../databases";
import response from "../utils/response";
import { async } from "regenerator-runtime";

const login = async (req, res, next) => {
  try {
    const User = new userTable();
    const id = req.body.id;
    const password = req.body.password;

    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, "사용자를 찾을 수 없습니다."));
    }

    // 비밀번호 compare
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return next(createError(422, "비밀번호를 확인 해주세요."));
    }

    // jwt payload 에 담길 내용
    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
    res.cookie("jwt", token, { httpOnly: true });

    return response(res, { token });
  } catch (e) {
    next(e);
  }
};

const signUp = async (req, res, next) => {
  try {
    const User = new userTable();

    const id = req.body.id;
    const password = req.body.password;
    if (id === "" || password === "") {
      return next(createError(400, "아이디, 패스워드를 입력해주세요."));
    }
    const user = await User.findById(id);
    if (user) {
      return next(createError(409, "아이디가 중복되었습니다."));
    }
    const userData = {
      id,
      password,
    };

    await User.store(userData);
    return response(res);
  } catch (e) {
    next(e);
  }
};

const tokenTest = async (req, res, next) => {
  try {
    return response(res, req.user);
  } catch (e) {
    next(e);
  }
};

export { login, tokenTest, signUp };
