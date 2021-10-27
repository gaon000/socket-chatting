// group chat

import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from "../utils/users";
import messageFormat from "../utils/messages";
import { GroupMessageTable } from "../databases";
import jwt from "jsonwebtoken";

const GroupMessage = new GroupMessageTable();

export default function direct(io) {
  io.use((socket, next) => {
    try {
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
    } catch (e) {
      return next(new Error(e));
    }
  }).on("connection", (socket) => {
    socket.on("joinRoom", async ({ room }) => {
      try {
        const user = userJoin(socket.id, socket.decoded.id, room);

        socket.join(user.room);
        socket.emit("message", messageFormat("bot", "welcome"));
        let message = `${socket.decoded.id} user has joined the chat`;

        socket.broadcast
          .to(user.room)
          .emit("message", messageFormat("bot", message));
        await GroupMessage.store({
          senderId: "bot",
          message,
          roomId: user.room,
        });

        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("chatMessage", async (msg) => {
      try {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", messageFormat(user.userId, msg));
        await GroupMessage.store({
          senderId: user.userId,
          message: msg,
          roomId: user.room,
        });
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("disconnect", () => {
      try {
        const user = userLeave(socket.id);
        if (user) {
          io.to(user.room).emit(
            "message",
            messageFormat("", `${user.userId} user has left the chat`)
          );
        }
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
}
