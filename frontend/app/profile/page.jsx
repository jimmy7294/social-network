
"use client"

import React, {useState} from "react";

function getYourProfile(){
    const [profile, setProfile] = useState([]);
    fetch("http://localhost:8080/api/getYourProfile", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then ((data) => data.json())
        .then((data) => {
            if(data.status !== "success"){
                console.log("failed to get profile")
                return
            }
            console.log(data)
            setProfile(data.profile)
        })
    return(
        <>
        <div className="profile">
            <h1>your profile</h1>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <p>{profile.first_name}</p>
            <p>{profile.last_name}</p>
            <p>{profile.following}</p>
            <p>{profile.followers}</p>
        </div>
        </>
    )
}
export default getYourProfile