"use client";
import Link from "next/link";
import  { use, useEffect, useState } from "react";
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
      {notification && <div className="notification"> </div>
      }
        <div className="tinyavatar">
          <img
            className="pfp"
            src= {avatar}
            alt="Your Company"
          /> 
        <Link className="link-up" href="/profile">{username}</Link>
        </div>
         
      </>
    );  
}

function Logout() {
  Cookies.set('session_token', 'value', { expires: 0, path: '/' })
  console.log("logout bitch")

  
  

}






const Headers = () => {
  return (
    <header className="headbar">
      
      <div className="identity">
      <img
          className="logo"
          src="http://localhost:8080/images/Rickrolling.png"
          alt="Your Company"
        />
          <Link className="name" href="/">Dummy Antisocial Network</Link>
      </div>
      <GetTinyProfile/>
        <div className="navigate">
          <Link className="link-up" href="/profile">Profile</Link>
          <Link className="link-up" href="/group">Group</Link>
          <Link className="link-up" href="/chat">Chat</Link>
        </div>
          
        <div className="logout" >
       <a onClick ={() => {Logout()}} href="/login">log out</a>
       </div>
        
    </header>
  );
};

export default Headers;
