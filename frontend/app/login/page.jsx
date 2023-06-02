"use client"

import Link from "next/link";
import { useState } from "react";
import {useRouter} from "next/navigation";
import cookie from "js-cookie"



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cok = cookie.get("test")
    let cok2 = cookie.get()
    console.log(cok)
    console.log(cok2)
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    console.log("Register data:", data);

    if (data.error) {
      console.error("Error:", data.error);
    } else {
      cookie.set("session_token", data.token)
      router.push("/")
    }
  };
  return (
    <>
      <div className="headbar">
        <img
          className= "logo"  
          src= "../public/images/Rickrolling.png"
          alt= "Your Company"
        />
        <h1>Irelevant Discussion</h1>
      </div>
      <div className="signin-window">
        <h2>Sign in</h2>
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="email">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              ></input>
            </div>
          </div>
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <a href="https://youtu.be/eY52Zsg-KVI" className="forgot">
            Forgot password?
          </a>
          <div className="padder">
            <button type="submit">Sign in</button>
          </div>
        </form>

        <p className="text">
          Not a user?{" "}
          <Link href="/register" className="link-up">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
}
