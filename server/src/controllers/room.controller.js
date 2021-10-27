import response from "../utils/response";
import { getRooms } from "../utils/users";

const get = async (req, res, next) => {
  try {
    if (req.user.id) {
      const rooms = getRooms();
      return response(res, { rooms });
    } else {
      throw createError(httpStatus.FORBIDDEN, "권한이 없습니다.");
    }
  } catch (e) {
    next(e);
  }
};

export { get };
