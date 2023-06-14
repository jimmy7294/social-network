"use client"

import { useState, useEffect } from "react";



  




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
        console.log(data.status)
        if (data.status !== "success") {
         console.log("lahdslsad")
          return
        }
        setFollwing(data.following)
      });
    
  }, []);
  console.log(following)

  const handleFollow = (action) => {
    console.log(action)
    fetch("http://localhost:8080/api/followthis",{
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(slug.params.slug, action),
  })
  .then((data) => data.json())
  .then((data) => {
    if (data.status !== "success"){
      console.log("unfollow/follow failed")
      return
    }
    console.log("unfollow/follow success")
  })
}
  if (following){
    return (
      <>
      <button value ="unfollow" onClick={(e) => handleFollow(e.target.value)}>Unfollow</button>

      </>
    )
  } else {
    return (
      <>
      <button value="follow" onClick={(e) => handleFollow(e.target.value)}>Follow</button>
      </>
    )
  }


}



function getProfile(slug) {
  const user = decodeURIComponent(slug.params.slug)
  console.log("user:", user)

  const [stuff, setStuff] = useState([]);

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
        <p> {stuff.avatar}</p>
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
        

function ProfilePage(slug){


return (<>
  <div className="ProfilePage">
    {getProfile(slug)}
    {followCheck(slug)}
  </div>
</>)


}

  

export default ProfilePage;
