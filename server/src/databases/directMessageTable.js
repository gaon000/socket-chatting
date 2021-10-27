import models from "../models";
const Op = models.Sequelize.Op;

export default class DirectMessageTable {
  async store(data) {
    return await models.DirectMessage.create(data);
  }

  async getMessages(senderId, receiverId) {
    try {
      return await models.DirectMessage.findAll({
        where: {
          [Op.or]: [
            { [Op.and]: [{ senderId: senderId }, { receiverId: receiverId }] },
            { [Op.and]: [{ senderId: receiverId }, { receiverId: senderId }] },
          ],
        },
        attributes: ["createdAt", "message", "senderId"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
