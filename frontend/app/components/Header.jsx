"use client";
//import Link from "next/link";
import  {  useEffect, useState } from "react";
import Cookies from "js-cookie";
import PrintNewMessage from "../page.jsx";




//export const newWS = new WebSocket("ws://localhost:8080/api/ws")

// if(msg.type === "message"){
//   if(pathname === `"/chat/"${msg.sender}`){
//     PrintNewMessage(msg)
//   }
// } else if(msg.type === "notification"){
//   GetNotification()
// }



function GetTinyProfile() {
  const [username, setUsername] = useState([]);
  const [avatar, setAvatar] = useState([]);
const [msg, setMsg] = useState([]);
/* console.log("slug stuff",slug.param)
if (slug.param !== undefined) {
  console.log("slug", slug.param.slug, typeof slug.param.slug)
/*   let param = decodeURIComponent(slug.param.slug)
  if (param !== undefined) {
    console.log(param)
  } 
} */

  useEffect(() => {   

  fetch("http://localhost:8080/api/getHeadbar", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify("voff"),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log("failed to get profile");
        return;
      }
      console.log(data);
      setUsername(data.username);
      setAvatar(data.avatar);
    });
}, []);
    return (
      <>
        <a className="fit" href="/profile">
          <div className="tinyavatar">
          <img
            className="pfp"
            src= {avatar}
            alt="Your Avatar"
          /> 
        <div id="moo" className="link-up">{username}</div>
        </div>
         </a>
      </>
    );  
}

function Logout() {
  Cookies.set('session_token', 'value', { expires: 0, path: '/' })
}

function GetNotification() {
  const [notification, setNotification] = useState(false);
  const [number, setNumber] = useState([0]);
  useEffect(() => {
/*     newWS.onerror = err => console.error(err);
//newWS.onopen = () => setWS(newWS);
newWS.onmessage = (msg) => {
  let newMsg = JSON.parse(msg.data)
  if (newMsg.type === "notification") {
    console.log("new notification",msg)
  }
} */
  fetch("http://localhost:8080/api/getNotifications", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log("failed to get notification");
        return;
      }
      console.log(data, "here")
      if(data.notifications !== null){
        setNotification(true);
        setNumber(data.notifications.length);
      console.log(data, notification);
      }
    });
}, []);

    return (
      <>
      {notification == true && <a  href="/profile" className="notification"><p>{number}</p> <p className="notifText">NOTIFICATION</p></a>
      }
      </>
    );
}





const Headers = () => {
  return (
    <header className="headbar">
      <div className="identity">
        <a href="http://localhost:3000">
      <img
          className="logo"
          src="http://localhost:8080/images/Rickrolling.png"
          alt="Your Company"
        />
        </a>
      </div>
      <div>
      <GetTinyProfile/>
          <a href="/group" className="fit">
            <div className="groupeButton">Group</div>
            </a>
          <a href="/chat" className="fit">
            <div className="chatButton">Chat</div>
            </a>
            </div>
      <GetNotification/>
      <a href="/login" className="fit">
      <div className="logout">
       <div className="theSoundOfTaDaronne" onClick ={() => {Logout()}}>log out</div>
      </div>
      </a>
    </header>
  );
};

export default Headers;

