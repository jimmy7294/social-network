import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Optional() {
  const [nickname, setNickname] = useState("");
  //const [avatar, setAvatar] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/updateSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, aboutMe }),
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
          <label htmlFor="Nickname">Nickname</label>
          <div className="mt-2">
            <input
              id="Nickname"
              name="Nickname"
              type="Nickname"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
            ></input>
          </div>
          <div>
            <label htmlFor="aboutMe">About Me</label>
            <div className="aboutMe">
              {" "}
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
              <button type="submit" className="padder">
                Finnish
              </button>
            </div>
          </div>
        </form>
        <p className="">
          don't wanna expose yourself ? <br></br>
          <Link href="/entry/login" className="link-up">
            Skip
          </Link>
        </p>
      </div>
    </>
  );
}
