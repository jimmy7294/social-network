import Group from "@/app/components/Group";
import Link from "next/link";

const GroupPage = ({ params: { id } }) => {
  // dummy data
  const data = {
    group_name: "Bikupan 2023",
    group_description:
      "The Bikupan 2023 group where we discuss everything related to anything but studies",
    group_members: [
      "Jimmy",
      "Jennie",
      "Rasmus",
      "Argann",
      "Christoffer",
      "Aaron",
    ],
    group_posts: Array.from({ length: 5 }, (_, i) => ({
      title: `Post:${i + 1}`,
      body: `This is the body of post ${i + 1}`,
    })),
  };
  console.log("params", id);

  return (
    <main>
      <div className="card">
        <h1>{data.group_name}</h1>
        <p>{data.group_description}</p>
        <h2>Members:</h2>
        <ul>
          {data.group_members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
        <h2>Posts:</h2>
        <ul>
          {data.group_posts.map((post) => (
            <li key={post.title}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <Link href="/profile/group" className="btn btn-back">
          Back to group list
        </Link>
        <Group id={id} />
      </div>
    </main>
  );
};

export default GroupPage;
