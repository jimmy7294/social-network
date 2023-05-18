import Link from "next/link";

async function fetchProfile() {
  const response = await fetch("http://localhost:3000/api/user", {
    next: {
      revalidate: 60, // revalidate every 60 seconds
    },
  });
  const profile = await response.json();
  return profile;
}

const ProfileComponent = async () => {
  const profile = await fetchProfile();

  return (
    <div className="profile">
      {profile.map((profile) => (
        <div key={profile.id} className="card">
          <h2>Username: {profile.username}</h2>
          <h2>Email: {profile.email}</h2>
          <h2>First Name: {profile.firstname}</h2>
          <h2>Last Name: {profile.lastname}</h2>
          <h2>Bio: {profile.bio}</h2>
          <h2>Birthday: {profile.birthday}</h2>
          <h2>Groups you've joined:</h2>
          <Link href="/profile/group/" className="btn">
            Go to your community
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProfileComponent;
