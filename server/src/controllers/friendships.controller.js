import { async } from "regenerator-runtime";
import { followTable } from "../databases";
import { FriendTable } from "../databases";
import response from "../utils/response";

const Follow = new followTable();
const Friend = new FriendTable();

const getFollowers = async (req, res, next) => {
  try {
    if (req.params.id) {
      const followers = await Follow.getFollowers(req.params.id);
      return response(res, { followers });
    }
  } catch (e) {
    next(e);
  }
};

const getFollowings = async (req, res, next) => {
  try {
    if (req.params.id) {
      const followings = await Follow.getFollowings(req.params.id);
      return response(res, { followings });
    }
  } catch (e) {
    next(e);
  }
};

const getFriends = async (req, res, next) => {
  try {
    if (req.user.id) {
      const friends = await Friend.getFriends(req.user.id);
      return response(res, { friends });
    } else {
      throw createError(httpStatus.FORBIDDEN, "권한이 없습니다.");
    }
  } catch (e) {
    next(e);
  }
};

const requestFriend = async (req, res, next) => {
  console.log(req.body);
  console.log(req.user);
  try {
    if (req.user.id) {
      const data = {
        userId: req.user.id,
        friend_id: req.params.id,
      };
      await Friend.store(data);
      return response(res);
    } else {
      throw createError(httpStatus.FORBIDDEN, "권한이 없습니다.");
    }
  } catch (e) {
    next(e);
  }
};

const requestFollow = async (req, res, next) => {
  try {
    const data = {
      followerId: req.user.id,
      followingId: req.body.following_id,
    };
    await Follow.store(data);
    return response(res);
  } catch (e) {
    next(e);
  }
};

const deleteFriend = async (req, res, next) => {
  try {
    if (req.user.id) {
      await Friend.deleteFriend(req.user.id, req.params.id);
      return response(res);
    } else {
      throw createError(httpStatus.FORBIDDEN, "권한이 없습니다.");
    }
  } catch (e) {
    next(e);
  }
};

const getFriendsInbox = async (req, res, next) => {
  try {
    if (req.user.id) {
      const inbox = await Friend.getFriendsInbox(req.user.id);
      return response(res, { inbox });
    } else {
      throw createError(httpStatus.FORBIDDEN, "권한이 없습니다.");
    }
  } catch (e) {
    next(e);
  }
};

export {
  getFollowers,
  getFollowings,
  requestFollow,
  getFriends,
  requestFriend,
  deleteFriend,
  getFriendsInbox,
};
