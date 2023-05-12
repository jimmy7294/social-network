import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Optional() {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [private, setPrivate] = useState(false);


  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/updateSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, aboutMe,private,avatar }),
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
        <form className="" onSubmit={handleSubmit}>
        <label for="image">Choose an image:</label>
  <input type="file" name="image" id="image">
  <input type="submit" value="Upload">
          </div>
          <label htmlFor="aboutMe">About Me</label>
            <div className="aboutMe">
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
            <div>
                <label for="image">Choose an image:</label>
              <input type="file" name="image" id="image"></input>
               <input type="submit" value="Upload"></input>
            </div>
            <div>
            <input type="radio" id="public" name="access" value="public"></input>
            <label for="public">Public</label><br></br>
            <input type="radio" id="private" name="access" value="private"></input>
             <label for="private">Private</label><br></br>
            </div>


        <div className="finish">
          <button type="submit" className="">
            Finnish
          </button>
        </div>
        </form>

        <p className="text">
          don't wanna expose yourself? {" "}
          <Link href="/entry/login" className="link-up">
            Skip
          </Link>
        </p>
      </div>
    </>
  );
}