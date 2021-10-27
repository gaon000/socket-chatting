import express from "express";
import { get, getAllUsers } from "../controllers/user.controller";

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id?").get(get);

export default router;
