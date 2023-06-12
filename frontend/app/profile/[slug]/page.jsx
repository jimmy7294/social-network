


function getProfile(slug) {
  const user = decodeURIComponent(slug.params.slug)
  console.log("user:", user)

  
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
        } else {
          console.log(data);
        }
      });
  
return user;


  // const profile = response.json();
  // console.log("profile:", profile);
  // if(profile.status == "success"){
  // console.log("profile data:", profile);
  // } else {
  //   console.log("error profile fetch")
  // }
  // return profile;
}

function ProfilePage(slug){
const page = getProfile(slug);
return null

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
