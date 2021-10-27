import express from "express";
import {
  getFriends,
  getFollowers,
  getFollowings,
  requestFriend,
  requestFollow,
  deleteFriend,
  getFriendsInbox,
} from "../controllers/friendships.controller";
const router = express.Router();

router.route("/:id/followings").get(getFollowings);
router.route("/:id/followers").get(getFollowers);

router.route("/friends").get(getFriends);

router.route("/inbox").get(getFriendsInbox);

router.route("/:id/friend").post(requestFriend);

router.route("/:id/follow").post(requestFollow);

router.route("/:id/friend").delete(deleteFriend);

export default router;
