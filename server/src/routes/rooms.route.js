import express from "express";
import { get } from "../controllers/room.controller";
const router = express.Router();

router.route("/").get(get);

export default router;
