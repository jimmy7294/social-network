"use client"
import React, { useState, useEffect } from "react";

function getProfile() {
    const [stuff, setStuff] = useState([]);
    const [followers, setFollowers] = useState([]);
  
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
            setStuff(data);
            setFollowers(data.followers);
          
        });
    }, []);
    console.log(followers,"moo")
        return (
          <>
          <div className="Profile">
            <h2>Profile</h2>
         
          <p> {stuff.email}</p>
          <p> {stuff.first_name}</p>
          <p> {stuff.last_name}</p>
          <p> {stuff.dob}</p>
        
             <img src = {stuff.avatar}/>
      
          <p> {stuff.username}</p>
          <p> {stuff.bio}</p>
          <p> {stuff.privacy}</p>
          <p> {stuff.following}</p>
          <p> {stuff.groups}</p>
              </div>

              <div>
              <h2>Followers</h2>
              {followers.map((follower,index) => (
                <div  key={index} className="follower">
                  <p>{follower}</p>
              </div>
              ))}
              </div>
              
        
       
                  
            </>
          );
          }


export default getProfile;