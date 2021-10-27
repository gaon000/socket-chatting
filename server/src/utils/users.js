// 소켓 룸, 유저 관리

const users = [];

function userJoin(id, userId, room) {
  const user = { id, userId, room };
  room;

  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

function getRooms() {
  const result = {
    1: getRoomUsers("1").length,
    2: getRoomUsers("2").length,
  };
  return result;
}

export { userJoin, getCurrentUser, userLeave, getRoomUsers, getRooms };
