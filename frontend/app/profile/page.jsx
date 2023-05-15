export const metadata = {
  title: "About Me",
};

const ProfilePage = (data) => {
  return (
    <div>
      ProfilePage
      <h1>Username: {data.username}</h1>
      <h1>Email: {data.email}</h1>
      <h1>First Name: {data.first_name}</h1>
      <h1>Last Name: {data.last_name}</h1>
      <h1>Bio: {data.about_me}</h1>
      <h1>Birthday: {data.DOB}</h1>
    </div>
  );
};

export default ProfilePage;
