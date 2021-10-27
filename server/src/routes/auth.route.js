import express from "express";
import {
  login,
  logout,
  signUp,
  tokenTest,
} from "../controllers/auth.controller";

const router = express.Router();

router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/tokenTest").get(tokenTest);

export default router;
