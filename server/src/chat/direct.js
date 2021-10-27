//DM

import messageFormat from "../utils/messages";
import { DirectMessageTable } from "../databases";
const jwt = require("jsonwebtoken");

const DirectMessage = new DirectMessageTable();
const login_ids = {};

export default function group(io) {
  // token 검증
  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        process.env.jWT_SECRET,
        (err, decoded) => {
          if (err) return next(new Error("Authentication error"));
          socket.decoded = decoded;
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  }).on("connection", (socket) => {
    // user id 대상에게 DM
    login_ids[socket.decoded.id] = socket.id;
    socket.on("chatMessage", async (msg) => {
      try {
        socket
          .to([login_ids[msg.recipient]])
          .emit("message", messageFormat(socket.decoded.id, msg.data));
        await DirectMessage.store({
          senderId: socket.decoded.id,
          receiverId: msg.recipient,
          message: msg.data,
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
}
