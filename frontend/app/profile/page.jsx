export const metadata = {
  title: "About Me",
};

// create a dummy data object

const ProfilePage = (data) => {
  data = {
    username: "Jennie",
    email: "chachacha@eurovision.eu",
    first_name: "Jennie",
    last_name: "Jay",
    about_me: "I'm a singer, dancer, rapper, and model",
    DOB: "1996-01-16",
    avatar: "https://i.imgur.com/3gYQ3v8.jpg",
    followers: ["Jimmy", "Jennie", "Rasmus", "Argann", "Christoffer", "Aaron"],
    following: ["Jimmy", "Jennie", "Rasmus", "Argann", "Christoffer", "Aaron"],
  };
  return (
    <div>
      ProfilePage
      <h1>Username: {data.username}</h1>
      <h1>Email: {data.email}</h1>
      <h1>First Name: {data.first_name}</h1>
      <h1>Last Name: {data.last_name}</h1>
      <h1>Bio: {data.about_me}</h1>
      <h1>Birthday: {data.DOB}</h1>
      <h1>Avatar</h1>
      <img src={data.avatar} alt="Avatar" />
      <h1>Followers</h1>
      <ul>
        {data.followers.map((follower) => (
          <li key={follower}>{follower}</li>
        ))}
      </ul>
      <h1>Following</h1>
      <ul>
        {data.following.map((following) => (
          <li key={following}>{following}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
