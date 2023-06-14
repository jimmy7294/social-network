"use client"

import { useState, useEffect } from "react";


function follow(slug, action){
useEffect(()=>{
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
},[])
return
}


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
        if (data.satus !== "success") {
         console.log("lahdslsad")
          return
        }
        setFollwing(data.following)
      });
    
  }, []);
  if (following){
    return (
      <>
      <button>Unfollow</button>

      </>
    )
  } else {
    return (
      <>
      <button>Follow</button>
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

  
//   return (
//     <div>
//       ProfilePage
//       <h1>Username: {data.username}</h1>
//       <h1>Email: {data.email}</h1>
//       <h1>First Name: {data.first_name}</h1>
//       <h1>Last Name: {data.last_name}</h1>
//       <h1>Bio: {data.about_me}</h1>
//       <h1>Birthday: {data.DOB}</h1>
//       <h1>Avatar</h1>
//       <img src={data.avatar} alt="Avatar" />
//       <h1>Followers</h1>
//       <ul>
//         {data.followers.map((follower) => (
//           <li key={follower}>{follower}</li>
//         ))}
//       </ul>
//       <h1>Following</h1>
//       <ul>
//         {data.following.map((following) => (
//           <li key={following}>{following}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProfilePage;
export default ProfilePage;
