"use client"
import React, { useState, useEffect } from "react";
import Headers from "../components/Header";
import Link from "next/link";

function GetProfile() {
    const [profile, setprofile] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [groups, setGroups] = useState([]);
  
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
            console.log(data);
            setprofile(data);
            setFollowers(data.followers);
            setFollowing(data.following);
            setGroups(data.groups);
          
        });
    }, []);
        return (
          <>
          <div>
    <div className="layouter">
        <div className="Profile">
          <div className="title">
          <img className="logo" src={profile.avatar}/>
          </div>
            <h2>Profile</h2>
            <div className="profileDate">
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
            <div className="folow">
              <h2>Followers</h2>
              {followers && <div className="follower">
              {followers.map((follower,index) => (
                  <p><a key={index} href={`profile/${follower}`}>{follower}</a></p>
              ))}
              </div>
              }

              {following && <div className="follower">
                <h2>Following</h2>
                {following.map((follow,index) => (
                <p><a key={index} href={`profile/${follow}`}>{follow}</a></p>
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