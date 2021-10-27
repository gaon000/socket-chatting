import models from "../models";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

export default class FollowTable {
  async store(data) {
    return await models.Follow.create(data);
  }

  async getFollowers(id) {
    try {
      return await models.Follow.findAll({
        where: {
          followingId: id,
        },
        attributes: ["followerId"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  async getFollowings(id) {
    try {
      return await models.Follow.findAll({
        where: {
          followerId: id,
        },
        attributes: ["followingId"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
