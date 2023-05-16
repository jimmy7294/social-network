async function fetchGroup(id) {
  // fetch some post data from a random API
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: {
      revalidate: 60, // revalidate every 60 seconds
    },
  });
  const group = await res.json();
  return group;
}

const Group = async ({ id }) => {
  const group = await fetchGroup(id);
  console.log("GROUP fetched from fetchGroup", group);

  return (
    <>
      <h2>
        This is the data fetching from
        https://jsonplaceholder.typicode.com/posts/
      </h2>
      <div>Group {group.id}</div>
      <h2>{group.title}</h2>
      <p>{group.body}</p>
    </>
  );
};

export default Group;
