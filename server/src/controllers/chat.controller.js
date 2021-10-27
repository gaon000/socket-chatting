import models from "../models";
import httpStatus from "http-status";
import createError from "http-errors";
import response from "../utils/response";
import { GroupMessageTable, DirectMessageTable } from "../databases";
import messageFormat from "../utils/messages";

const GroupMessage = new GroupMessageTable();
const DirectMessage = new DirectMessageTable();

const get = async (req, res, next) => {
  try {
    const result = [];
    let messages;
    if (req.query.type === "group" && req.query.id !== undefined) {
      messages = await GroupMessage.getMessages(req.query.id);

      if (!messages) {
        throw createError(httpStatus.NOT_FOUND, "그룹채팅을 찾을 수 없습니다.");
      }
    } else if (req.query.type === "direct" && req.query.id !== undefined) {
      messages = await DirectMessage.getMessages(req.user.id, req.query.id);
    } else {
      return response(res);
    }

    for (let data of messages) {
      result.push(messageFormat(data.senderId, data.message, data.createdAt));
    }

    return response(res, result);
  } catch (e) {
    next(e);
  }
};

export { get };
