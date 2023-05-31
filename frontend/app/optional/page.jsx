"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";



async function Avatars(){
  const result = await fetch("http://localhost:8080/api/getYourImages",{
  method: "POST",
  credentials: "include",
  headers:{
    "Content-Type": "application/json"
  }
}
)
if(!result.ok){
  throw new Error("Error fetinch avatar login")
}
const avatar = await result.json()
console.log(avatar)
return (avatar)
}






export default function Optional() {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [hidden, setPrivate] = useState(false);
  

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/updateSettings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, aboutMe, avatar, hidden }),
    });
    const data = await response.json();
    console.log("Register data:", data);

    //setRegistrationDone(true) and hide the mandatory form, show the optional form
    if (data.status === "success") {
      router.push("/");
    }
  };
  return (
    <>
      <div className="headbar">
        <img
          className="logo"
          src="../images/Rickrolling.png"
          alt="Your Company"
        />
        <h1> Irelevant Discussion </h1>
      </div>

      <div className="signin-window">
        <form className="sorting" onSubmit={handleSubmit}>
          <div className="container">
            <a  type="submit" id="pp" className="pick-me-profile">
              <img src={Avatars()} id="pp" className="pfp"></img>
            </a>
          </div>
          <div>
            <label id="image">Choose an image:</label>
            <input type="file" name="image" id="image"></input>
            <input className="imgSubmit" type="submit" value="Upload"></input>
          </div>
          <br />
          <label id="aboutMe">About Me</label>
          <div>
            <textarea
              id="aboutMe"
              name="aboutMe"
              type="aboutMe"
              placeholder="About Me"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="aboutMe"
            ></textarea>
          </div>
          <br />
          <label id="nickname">Nickname</label>
          <div className="mt-2">
            <input
              id="nickname"
              name="nickname"
              type="nickname"
              placeholder="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
            ></input>
          </div>
          <div>
            <input
              type="radio"
              id="public"
              name="access"
              value="public"
            ></input>
            <label id="public">Public</label>
            <br></br>
            <input
              type="radio"
              id="private"
              name="access"
              value="private"
            ></input>
            <label id="private">Private</label>
            <br></br>
          </div>

          <div className="finish">
            <button type="submit" className="">
              Finnish
            </button>
          </div>
        </form>

        <p className="text">
          don't wanna expose yourself?{" "}
          <Link href="/entry/login" className="link-up">
            Skip
          </Link>
        </p>
      </div>
    </>
  );
}
