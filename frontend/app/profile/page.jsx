"use client"
import React, { useState, useEffect } from "react";

function getProfile() {
    const [profile, setprofile] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
  
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
          
        });
    }, []);
    console.log(followers,"moo")
        return (
          <>
          <div className="Profile">
            <h2>Profile</h2>
         
          <p> {profile.email}</p>
          <p> {profile.first_name}</p>
          <p> {profile.last_name}</p>
          <p> {profile.dob}</p>
        
             <img src = {profile.avatar}/>
      
          <p> {profile.username}</p>
          <p> {profile.bio}</p>
          <p> {profile.privacy}</p>
          <p> {profile.following}</p>
          <p> {profile.groups}</p>
              </div>

              <div>
              <h2>Followers</h2>
              {followers && <div>
              {followers.map((follower,index) => (
                <div  key={index} className="follower">
                  <p>{follower}</p>
              </div>
              ))}
              </div>
}
              </div>
              
              {following && <div>
              <h2>Following</h2>
              {following.map((follow,index) => (
                <div key={index} className="follow">
                  <p>{follow}</p>
              </div>
              ))}
              </div>
              }
              
        
       
                  
            </>
          );
          }


export default getProfile;