import Link from "next/link";

const Headers = () => {
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
          <Link className="link-up" href="/profile/group">Group</Link>
          <Link className="link-up" href="/chat">Chat</Link>
          <Link className="link-up" href="/post/">Post</Link>
        </div>
    </header>
  );
};

export default Headers;
