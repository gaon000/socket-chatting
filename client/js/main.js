const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const token = localStorage.getItem("access-token");

// 이전 대회 목록 불러오기

const socket = io.connect("http://127.0.0.1:3000", {
  secure: true,
  transports: ["websocket"],
  query: { token },
});
socket
  .on("connect", async () => {
    console.log("**************");
    console.log("successful hand shake");
    console.log("**************");

    const res = await fetch(
      `http://127.0.0.1:3000/messages?type=group&id=${room}`,
      {
        method: "GET",
        mode: "cors",
      }
    );
    const data = await res.json();
    for (let i of data.data) {
      outputMessage(i);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  })
  .on("error", (err) => {
    console.log("******ERROR********");
    console.log("******ERROR********");
    console.log(err);
    console.log("******ERROR********");
  });

//join chatroom
socket.emit("joinRoom", { room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get Message chat
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.userId}<span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.userId}</li>`).join("")}
  `;
}
