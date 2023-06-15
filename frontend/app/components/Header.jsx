import Link from "next/link";

 function getTinyProfile() {
  fetch("http://localhost:8080/api/getProfile", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify("voff"),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log("failed to get profile");
        return;
      }
      console.log(data);
      return data;
    });
}






const Headers = () => {
  const data = getTinyProfile()
  return (
    <header className="headbar">
      <div className="identity">
      <img
          className="logo"
          src="http://localhost:8080/images/Rickrolling.png"
          alt="Your Company"
        />
          <Link className="name" href="/">Dummy Antisocial Network</Link>
      </div>
        <div className="navigate">
          <Link className="link-up" href="/profile">Profile</Link>
          <Link className="link-up" href="/group">Group</Link>
          <Link className="link-up" href="/chat">Chat</Link>
          <Link className="link-up" href="/post/">Post</Link>
        </div>
        <div className="tinyavatar">
          <img
            className="avatar"
            src={data.avatar}
            />
        </div>
        <div className="tinyname">
          <Link className="link-up" href="/profile">{data.username}</Link>
        </div>
        <div className="logout"><Link className="link-up" href="/post/">log out</Link></div>
    </header>
  );
};

export default Headers;
