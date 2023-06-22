"use client"

import { useState, useEffect } from "react";
import Headers from "../../components/Header";




  




function followCheck(slug){
  
  const [following, setFollwing] = useState(Boolean)
  const user = decodeURIComponent(slug.params.slug)
  useEffect(() => {
    fetch("http://localhost:8080/api/followCheck", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("follow check failed")
          return
        }
        setFollwing(data.following)
      });
    
  }, []);

  const handleFollow = () => {
    fetch("http://localhost:8080/api/addOrRemoveFollow",{
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user),
  })
  .then((data) => data.json())
  .then((data) => {
    if (data.status !== "success"){
      console.log(data.status)
      console.log("unfollow/follow failed")
      return
    }
    console.log("unfollow/follow success 123213 12", user)
   
  })
}
  if (following){
    return (
      <>
      <a href={`${user}`}>
      <button  onClick={() => handleFollow()}>Unfollow</button>
      </a>
      </>
    )
  } else {
    return (
      <>
      <a href={`${user}`}>
      <button onClick={() => handleFollow()} >Follow</button>
      </a>
      </>
    )
  }


}



function GetProfile(slug) {
  const user = decodeURIComponent(slug.params.slug)
  const [stuff, setStuff] = useState([]);
  console.log(user)

  useEffect(() => {
    fetch("http://localhost:8080/api/getProfile", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("get profile failed", data); // Update the state with fetched data
        } 
        setStuff(data);

        
      });
  }, []);
  console.log(stuff)
  if(stuff.status !== "private"){
  
      return (
        <>
        <div className="Profile">
          <h2>Profile</h2>
          <img src={stuff.avatar}/>
       
        <p> {stuff.email}</p>
        <p> {stuff.first_name}</p>
        <p> {stuff.last_name}</p>
        <p> {stuff.dob}</p>
        <div>
        
        </div>
        <p> {stuff.username}</p>
        <p> {stuff.bio}</p>
        <p> {stuff.privacy}</p>
        <p> {stuff.followers}</p>
        <p> {stuff.following}</p>
        {}
            </div>   
          </>
        );
        }
        console.log(stuff)
        return(
          <>
          <div>
            <h2>Profile</h2>
            <div>
              {stuff.email}
              </div>
          </div>
          </>
        )
      }
        

function ProfilePage(slug){


return (<>
  <Headers />
  <div className="ProfilePage">
    {GetProfile(slug)}
    {followCheck(slug)}
  </div>
</>)


}

  

export default ProfilePage;
