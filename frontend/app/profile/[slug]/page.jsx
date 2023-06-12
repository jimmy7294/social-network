"use client"

import { useState, useEffect } from "react";


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
        
        function HomePage() {
        
          return (
            <div>
              <h1>Meow meow meow</h1>
              <GetPosts />
            </div>
          )



}

function ProfilePage(slug){
const page = getProfile(slug);
return page

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
