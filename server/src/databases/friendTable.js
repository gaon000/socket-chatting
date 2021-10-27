import models from "../models";
import Sequelize from "sequelize";
import e from "express";

const Op = Sequelize.Op;

export default class FriendTable {
  async store(data) {
    return await models.Friends.create(data);
  }

  async getFriends(id) {
    const query = `
    select f1.* from Friends f1 inner join Friends f2 on f1.userId = f2.friend_id and f1.friend_id = f2.userId and f1.userId = '${id}';
    `;
    try {
      return await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async getFriendsInbox(id) {
    const query = `
    select * from Friends f1 where not exists(select * from Friends f2 where f1.userId = f2.friend_id and f1.friend_id = f2.userId) and friend_id='${id}';`;
    try {
      return await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteFriend(id, friend_id) {
    try {
      return await models.Friends.destroy({
        where: {
          userId: id,
          friend_id,
        },
      }).then(async (res) => {
        await models.Friends.destroy({
          where: {
            userId: friend_id,
            friend_id: id,
          },
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async denyRequest(id, friend_id) {
    try {
      return await models.Friends.destroy({
        where: {
          userId: id,
          friend_id,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async getRequestableFriends(id) {
    try {
      return await models.Friends.findAll({
        where: {
          userId: id,
        },
        attributes: ["friend_id"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
