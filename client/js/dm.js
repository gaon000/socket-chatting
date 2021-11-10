const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { recipient } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

function messageFormat(userId, text) {
  return {
    userId,
    text,
    time: moment(new Date()).format("h:mm a"),
  };
}

const token = localStorage.getItem("access-token");
const userId = localStorage.getItem("userId");

// 이전 대회 목록 불러오기

const socket = io.connect(
  "http://ec2-3-36-49-30.ap-northeast-2.compute.amazonaws.com:3000/dm",
  {
    query: { token },
  }
);
socket
  .on("connect", async () => {
    console.log("**************");
    console.log("successful hand shake");
    console.log("**************");

    const res = await fetch(
      `http://ec2-3-36-49-30.ap-northeast-2.compute.amazonaws.com:3000/messages?type=direct&id=${recipient}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    console.log(data);
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

//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get Message chat
  const msg = {
    data: e.target.elements.msg.value,
    recipient,
  };

  // Emit message to server
  socket.emit("chatMessage", msg);
  outputMessage(messageFormat(userId, msg.data));

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  chatMessages.scrollTop = chatMessages.scrollHeight;
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

roomName.innerText = recipient;
