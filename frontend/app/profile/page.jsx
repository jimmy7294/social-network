"use client"
import React, { useState, useEffect } from "react";

function getProfile() {
    const [stuff, setStuff] = useState([]);
  
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
          if (data.status === "success") {
            console.log(data);
            setStuff(data); // Update the state with fetched data
          } else {
            console.log(data);
          }
        });
    }, []);
    
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
          <p> {stuff.followers}</p>
          <p> {stuff.following}</p>
          <p> {stuff.groups}</p>
              </div>
              
        
       
                  
            </>
          );
          }


export default getProfile;