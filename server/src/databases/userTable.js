import models from "../models";
import sequelize from "sequelize";
const Op = sequelize.Op;

export default class UserTable {
  // CREATE
  async store(data) {
    return await models.User.create(data);
  }

  // READ
  async all(id) {
    const query = `SELECT id, createdAt, friendsNumber, requestable FROM userInfo b left join (select a.friend_id as friend_id, a.friend_id as requestable from Friends a where a.userId = '${id}') t on ( b.id = t.friend_id) where id != '${id}';`;
    try {
      return await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async find(id) {
    try {
      return await models.User.findOne({
        where: {
          id,
        },
        attributes: ["id", "createdAt", "updatedAt"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(id) {
    try {
      return await models.User.findOne({
        where: {
          id,
        },
        attributes: ["id", "createdAt", "updatedAt", "password"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  // UPDATE
  // DELETE
}
