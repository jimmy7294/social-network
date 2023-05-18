import Link from "next/link";

async function fetchPost() {
  // fetch some post data from a random API
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second
  const post = await res.json();
  return post;
}

const PostPage = async () => {
  const post = await fetchPost();
  return (
    <div className="post-container">
      <h1>Post Page</h1>
      <ul className="post-list">
        {post.map((post) => (
          <li key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostPage;
