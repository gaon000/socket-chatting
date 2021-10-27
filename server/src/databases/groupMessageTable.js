import models from "../models";

export default class GroupMessageTable {
  async store(data) {
    return await models.GroupMessage.create(data);
  }

  async getMessages(id) {
    try {
      return await models.GroupMessage.findAll({
        where: {
          roomId: id,
        },
        attributes: ["createdAt", "message", "senderId"],
        raw: true,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
