import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [registrationDone, setRegistrationDone] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstName, lastName, birthDate }),
    });
    const data = await response.json();
    console.log("Register data:", data);

    //setRegistrationDone(true) and hide the mandatory form, show the optional form
    if (data.status === "success") {
      setRegistrationDone(true);
    }
  };

  const handleSubmitOptional = async (e) => {
    e.preventDefault();
    // no backend code yet, so we'll just hardcode the response
    const data = { success: true };
    //Navigate to the login page after successful registration
    if (data.success) {
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
        {/* Mandatory */}
        <div
          className="signin-window"
        >
          <form className="" onSubmit={handleSubmit}>
            {/*Email*/}
            <h2>
            {registrationDone ? "Optional Information" : "Register"}
            </h2>
            <div>
              <label
                htmlFor="email"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email@Example"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field">
                  </input>
              </div>
            </div>
            {/*First Name*/}
            <div>
              <div>
                <label
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <div className="text-md"></div>
              </div>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="firstName"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"/>
              </div>
            </div>
            {/* Last Name */}
            <div>
              <div>
                <label
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <div className="text-md"></div>
              </div>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="lastName"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field" />
              </div>
            </div>
            {/* Birth Date */}
            <div>
              <div>
                <label
                  htmlFor="birthDate"
                >
                  Date of Birth
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  min="1899-01-01"
                  max="2023-01-01"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="input-field"/>
              </div>
            </div>
            {/* Password */}
            <div>
              <div>
                <label
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"/>
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="padder">
                Register
              </button>
            </div>
          </form>
        <p className="">
          Already a user?{" "}
          <Link
            href="/entry/login"
            className="link-up"
          >
            Login here
          </Link>
        </p>
        </div>
    </>
  );
}