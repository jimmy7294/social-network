import Link from "next/link";

const GroupListPage = ({ data }) => {
  // create a dummy list of groups
  data = Array.from({ length: 10 }, (_, i) => ({
    group_id: i + 1,
    group_name: `Group ${i + 1}`,
  }));

  return (
    <div>
      <h1>Group List Page</h1>
      <ul>
        {data.map((group) => (
          <li key={group.group_id}>
            <Link href={`/profile/group/${group.group_id}`}>
              {group.group_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupListPage;
