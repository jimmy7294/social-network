import Link from "next/link";
import { useState } from "react";
import Router from "next/router";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log("loginData:", data);

    if (data.status === "success") {
      // redirect to home page
      Router.push("/");
    } else {
      if (data.status === "fail") {
        data.errors.map((err) => {
          console.log(err.msg);
        });
      }
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
        <div class="signin-window"> 
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
                  class="input-field">
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
                  class="input-field"
                />
            </div>
            <a href="https://youtu.be/eY52Zsg-KVI" class="forgot">
                    Forgot password?
            </a>
            <div class="padder">
              <button type="submit">
                Sign in
              </button>
            </div>
           
          </form>

          <p className="mt-10 text-center text-md text-gray-500">
            Not a user?{" "}
            <Link
              href="/entry/register"
              class="link-up"
            >
              Register here
            </Link>
          </p>
        </div>
      
    </>
  );
}
