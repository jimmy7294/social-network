"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Headers from "../components/Header";
import encodeImageFile from "../components/encodeImage";

import Link from "next/link";



async function fetchAvatars(){
  const result = await fetch("http://localhost:8080/api/getYourImages",{
  method: "POST",
  credentials: "include",
  headers:{
    "Content-Type": "application/json"
  }
}
)
if(!result.ok){
  throw new Error("Error fetching avatar login")
}
const avatar = await result.json()

if (!avatar.stock_images) {
  return null; // or any other action you want to take when stock_images is not defined
}
console.log(avatar)
return avatar.stock_images;
}
function updateProfileImage(link, setAvatar) {
  console.log(link)
  setAvatar(link)
  return link
}

function Avatars({arg}) {
  const [stockImages, setStockImages] = useState([]);
  console.log()

  useEffect(() => {
    fetchAvatars()
      .then((images) => {
        console.log(images, "images")
        if (images) {
          setStockImages(images);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="padder">
        {stockImages.map((image, index) => (
          <img src={image} onClick={(e) => arg(image)} key={index} alt={`Avatar ${index}`} className="pfp" />
        ))}
      </div>
    </>
  );
        }











export default function Optional() {
  const [nickname, setNickname] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [privacy, setPrivate] = useState("");
  const [avatar, setAvatar] = useState("http://localhost:8080/images/default.jpeg");


  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(avatar)
    const response = await fetch("http://localhost:8080/api/updateSettings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, aboutMe, avatar, privacy }),
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
      <Headers />
      <div className="signin-window">
        <form className="sorting" onSubmit={handleSubmit}>
          <div className="padder">
          <img src= {avatar} alt="" value={0} className="avatar_preview" />  
          </div>
          <div className="container">
            <a  type="submit" id={0} className="pick-me-profile" >
              <Avatars arg={setAvatar}></Avatars>
            </a>
          </div>
          <div>
            <label id="image" >Choose an image:</label>
            <input type="file" id="image" name="image" onChange={e => encodeImageFile(e.target)}></input>
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
              className="titleCreation"
            ></input>
          </div>
          <div>
            <input
              type="radio"
              id="public"
              name="access"
              value="public"
              onClick={(e) => setPrivate(e.target.value)}
            ></input>
            <label id="public">Public</label>
            <br></br>
            <input
              type="radio"
              id="private"
              name="access"
              value="private"
              onClick={(e) => setPrivate(e.target.value)}
            ></input>
            <label id="private">Private</label>
            <br></br>
          </div>

          <div className="finish">
            <button type="submit" className="postCreationButton">
              Finish
            </button>
          </div>
        </form>

        <p className="text">
          don't wanna expose yourself?{" "}
          <Link href="/login" className="link-up">
            Skip
          </Link>
        </p>
      </div>
    </>
  );
}
