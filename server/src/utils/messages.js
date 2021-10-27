// 소켓 메세지 포멧

import moment from "moment";

function messageFormat(userId, text, date = undefined) {
  return {
    userId,
    text,
    time: moment(date).format("h:mm a"),
  };
}

export default messageFormat;
