"use client";
import Link from "next/link";
import  {  useEffect, useState } from "react";
import Cookies from "js-cookie";





function GetTinyProfile() {
  const [username, setUsername] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [notification, setNotification] = useState(false);
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
      {notification && <div className="notification"><p>NOTIFICATION</p> </div>
      }
        <a className="fit" href="/profile">
          <div className="tinyavatar">
          <img
            className="pfp"
            src= {avatar}
            alt="Your Avatar"
          /> 
        <div className="link-up">{username}</div>
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
  const [notificationdata, setNotificationdata] = useState([]);
  useEffect(() => {
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
        setNotification(true);
      console.log(data, notification);
      setNotificationdata(data.notificationdata);
    });
}, []);

    return (
      <>
      {notification && <div className="notification"><p className="notifText">NOTIFICATION</p></div>
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
          <a href="/msg" className="fit">
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
