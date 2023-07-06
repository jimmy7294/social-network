"use client"
import React, { useState, useEffect, use } from "react";
import Headers from "../components/Header";
import Link from "next/link";







function HandleFollowRequest(response, sender, reciever){}
  



function HandleGroupRequest(group_name, response, sender, reciever){
  console.log(sender)
  fetch("http://localhost:8080/api/handleGroupJoinRequest", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({group_name, response, reciever,sender}),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log("failed to handle group request");
        console.log(data.status)
        return;
      }
      console.log(data);
    });
}

function HandleGroupInvite(group_name, response, sender, reciever){
  console.log(sender, "sender")
  console.log(reciever, "reciever")
  console.log(group_name, "group_name")
  fetch("http://localhost:8080/api/handleGroupInvite", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({group_name, response, reciever,sender}),
      })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("failed to handle group invite");
          console.log(data.status)
          return;
        }
        console.log(data);
      });
    }



function GetNotification() {
  const [notification, setNotification] = useState([]);
  useEffect(() => {
  fetch("http://localhost:8080/api/getNotifications", {
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
        console.log("failed to get notifications");
        return;
      }
      console.log(data);
      setNotification(data.notifications);
    });
}, []);

console.log(notification,"sakldlak")
    return (
 <>
 {!notification && (
    <div className="notification_user">
      <p>NOTIFICATION</p>
      <p>No notifications</p>
      </div>
      )}
  {notification &&(
    <div className="notification_user">
      <p>NOTIFICATION</p>
      {notification.map((notification,index) => (
        <div key={index}>
          <p>{notification.content}, {notification.context}</p>
          <p>{notification.sender}</p>
          {notification.type === "group_join_request" && (
            <div>
              <button onClick ={() => HandleGroupRequest(notification.context, "accept", notification.sender, notification.reciever)}>Accept</button>
              <button onClick ={() => HandleGroupRequest(notification.context, "decline", notification.sender, notification.reciever)}>Decline</button>
            </div>
          )}
          {notification.type === "group_invite" && (
            <div>
              <button onClick ={() => HandleGroupInvite(notification.context, "accept", notification.sender, notification.reciever)}>Accept</button>
              <button onClick ={() => HandleGroupRequest(notification.context, "decline", notification.sender, notification.reciever)}>Decline</button>
            </div>
              )}
              {notification.type === "follow_request" && (
                <div>
                  <button onClick ={() => HandleGroupInvite(notification.context, "accept", notification.sender, notification.reciever)}>Accept</button>
                  <button onClick ={() => HandleGroupRequest(notification.context, "decline", notification.sender, notification.reciever)}>Decline</button>
                  </div>
              )}
    </div>
      ))}
    </div>  
  )}
 </>
    )

      }



function GetProfile() {
    const [profile, setprofile] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [groups, setGroups] = useState([]);
    const [created_posts, setCreatedPosts] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:8080/api/getProfile", {
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
            console.log(data);
          } 
            console.log(data, "profile");
            setprofile(data);
            setFollowers(data.followers);
            setFollowing(data.following);
            setGroups(data.groups);
            setCreatedPosts(data.created_posts);
          
        });
    }, []);
    console.log(created_posts, "created_posts")
        return (
          <>
          <div>
          <GetNotification/>
    <div className="layouter">
        <div className="Profile">
          <div className="title">
          <img className="logoProfile" src={profile.avatar}/>
          </div>
            <h2>Profile</h2>
            <div className="profileData">
          <p>Email: {profile.email}</p>
          <p> First Name: {profile.first_name}</p>
          <p> Last Name: {profile.last_name}</p>
          <p> BirthDay: {profile.dob}</p>
          <p> Nickname: {profile.username}</p>
          <p>Bio: {profile.bio}</p>
          <p>Privacy: {profile.privacy}</p>
          <a href="/optional" className="gibspace">
          <button className="postCreationButton">Change Profile</button>
          </a>
          </div>
              </div>
   
          <div>

        <div>
          
          {profile.created_posts && <div className="postListe">
          <h2>Posts</h2>
            {profile.created_posts.map((post,index) => (
              <div key={index}>
                <p>{post}</p>
              </div>
            ))}
          </div>
          }
          </div>


            <div className="folow">
              <h2>Followers</h2>
              {followers && <div className="follower">
              {followers.map((follower,index) => (
                  <p key={index} ><a href={`profile/${follower}`}>{follower}</a></p>
              ))}
              </div>
              }

              {following && <div className="follower">
                <h2>Following</h2>
                {following.map((follow,index) => (
                <p key={index}><a  href={`profile/${follow}`}>{follow}</a></p>
                 ))}
                </div>
              }

              
              {groups && <div>
              <h2>Groups</h2>
                {groups.map((group,index) => (

                  <div  key={index}>
                    <p> <a href="/group">{group}</a></p>
                    </div>
                ))}
          </div>
}
              </div>
            </div>
    </div>
    </div>
            </>
          );
          }



function ProfilePage(){
  return(
    <>
    <Headers/>
    
    <GetProfile/>
    </>
  )
}

export default ProfilePage;