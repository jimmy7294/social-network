import Link from "next/link";
import { useState } from "react";
import Router from "next/router";
import {signIn} from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the signIn function from next-auth/client
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      console.error("Error:", result.error);
    } else {
        console.log("login.jsx - Log in Success:", result)
        console.log("login.jsx - User credentials: ", email, password)
      Router.push("/main/yours");
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
          <h1>
            Irelevant Discussion
          </h1>
        </div>
        <div className="signin-window"> 
          <h2>
            Sign in
          </h2>
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field">
                  </input>
              </div>
            </div>
              <div>
                <label htmlFor="password">
                  Password
                </label>
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
              <button type="submit">
                Sign in
              </button>
            </div>
           
          </form>

          <p className="text">
            Not a user?{" "}
            <Link
              href="/entry/register"
              className="link-up"
            >
              Register here
            </Link>
          </p>
        </div>
      
    </>
  );
}
