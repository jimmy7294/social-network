export const metadata = {
  title: "About Me",
};

// create a dummy data object

function getProfile() {
  const response = fetch("http://localhost:8080/api/getProfile", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(data => data.json())
  .then(data => {
    if (data.status == "success"){
      console.log(data)
    } else {
      console.log(data)
    }
    })



  // const profile = response.json();
  // console.log("profile:", profile);
  // if(profile.status == "success"){
  // console.log("profile data:", profile);
  // } else {
  //   console.log("error profile fetch")
  // }
  // return profile;
}

function ProfilePage(){
const page = getProfile();
return (console.log(page))

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
