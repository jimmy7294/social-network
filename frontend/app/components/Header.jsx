import Link from "next/link";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link href="/">Dummy Antisocial Network</Link>
        </div>
        <div className="links">
          <Link href="/profile">Profile</Link>
          <Link href="/profile/group">Group</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/post/">Post</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
