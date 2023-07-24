// class Event {
//     constructor(data) {
//       this.sender = data.sender;
//       this.recipient = data.recipient;
//       this.content = data.content;
//       this.timestamp = data.timestamp;
//       this.type = data.type;
//     }
//   }

//let timeoutId;

//   function removeTyping() {
//     let el = document.querySelector(".typing");
//     if (el !== null) {
//       el.remove();
//       timeoutId = clearTimeout(timeoutId);
//     }
//   }

//   let socket;

//   window.onbeforeunload = function () {
//     preventDefault();
//     console.log("onbefore");
//     socket.close();
//     onNavigate("/");
//     return "fuck you";
//   };

export default function OpenChatSocket() {
  if (socket !== undefined) {
    return;
  }
  socket = new WebSocket("ws://localhost:8080/api/ws");
  console.log("Attempting Websocket Connetcion");
  socket.onmessage = function (evt) {
    const eventData = JSON.parse(evt.data);
    const event = Object.assign(new Event(eventData));
    routeEvent(event);
  };
  socket.onopen = () => {
    console.log("Connected");
  };

  socket.onclose = (event) => {
    console.log("Socket Closed", event);
    let name = "session_token";
    document.cookie = name + "=; Max-Age=-99999999;";
    console.log("closed and out");
  };

  socket.onerror = (error) => {
    console.log("Socket Error:", error);
  };
}

//   function routeEvent(event) {
//     if (
//       event.sender === undefined ||
//       event.recipient === undefined ||
//       event.content === undefined
//     ) {
//       alert("no 'type' field in event");
//     }
//     switch (event.type) {
//       case "user_message":
//         let el = document.querySelector(".chat-section");
//         if (
//           el !== null &&
//           (el.id === event.sender || el.id === event.recipient)
//         ) {
//           let newMsg = gatherMsg(
//             [
//               {
//                 sender: event.sender,
//                 message: event.content,
//                 timestamp: event.timestamp,
//               },
//             ],
//             el.id
//           );
//           if (el.id === event.sender) removeTyping();
//           let el2 = el.querySelector(".message-box")
//           let oldScrollSize = el2.scrollHeight
//           el2.appendChild(newMsg[0]);
//           let newScrollSize = el2.scrollHeight
//           el2.scrollTop = el2.scrollTop + (newScrollSize - oldScrollSize)
//         } else {
//           let msgSender = document.getElementById(`user-${event.sender}`);
//           console.log(msgSender);
//           if (
//             msgSender.classList.contains("you") === false &&
//             msgSender.classList.contains("new_Message") === false
//           ) {
//             console.log("received new_Message");
//             msgSender.classList.add("new_Message");
//           }
//         }
//         break;
//       case "typing_update":
//         let el2 = document.querySelector(".chat-section");
//         if (el2 !== null) {
//           if (el2.id === event.sender) {
//             if (timeoutId !== undefined) {
//               clearTimeout(timeoutId);
//             } else {
//               let elT = document.createElement("div");
//               elT.classList.add("typing");
//               el2.appendChild(elT).innerHTML = event.sender + " is typing...";
//             }
//             timeoutId = setTimeout(removeTyping, 3000);
//           }
//         }
//         break;
//       case "update_users":
//         getUsers();
//         break;
//     }
//   }

//   function sendMessage() {
//     let newmessage = document.getElementById("messafge");
//     if (/\S/.test(newmessage.value)) {
//       let receiver = document.querySelector(".chat-section").id;
//       socket.send(
//         JSON.stringify({
//           recipient: receiver,
//           content: newmessage.value,
//           type: "user_message",
//         })
//       );
//       newmessage.value = "";
//       getUsers();
//     }
//     return false;
//}
