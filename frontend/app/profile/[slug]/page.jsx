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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [groups, setGroups] = useState([]);
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
        setFollowers(data.followers);
        setFollowing(data.following);
        setGroups(data.groups);
        
      });
  }, []);
  console.log(stuff)
  if(stuff.status !== "private"){
  
      return (
        <>
      <div className="Profile">
        <div className="organiser">
        <img className="avatar_preview" src={stuff.avatar}/>
          <div className="passport">
            <p> {stuff.username}</p>
            <div className="birth_name">
            <p> {stuff.first_name}</p>
            <p> {stuff.last_name}</p>
            </div>
        </div>
            
          </div>
          <div className="docu">
            <p> {stuff.email}</p>
            <p> {stuff.bio}</p>
            <p> {stuff.privacy}</p>
            <p> {stuff.dob}</p>
          </div>
      </div>

      <div>
            <div className="folow">
              <h2>Followers</h2>
              {followers && <div>
              {followers.map((follower,index) => (
                <div  key={index} className="follower">
                  <a className="link-up" href={`profile/${follower}`}><p>{follower}</p> </a>
              </div>
              ))}
              </div>
              }

              {following && <div>
                <h2>Following</h2>
                {following.map((follow,index) => (
                  <div key={index}>
                    <p>{follow}</p>
                </div>
                ))}
                </div>
              }

              
              {groups && <div>
              <h2>Groups</h2>
                {groups.map((group,index) => (

                  <div  key={index}>
                    <p>{group}</p>
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
  <div className="layouter">
    {GetProfile(slug)}
    {followCheck(slug)}
  </div>
</>)


}

  

export default ProfilePage;
