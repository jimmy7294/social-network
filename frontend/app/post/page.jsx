import Link from "next/link";



const PostPage = async () => {


  const result = await fetch("localhost:8080/api/getallposts")

  if(!result.ok){
    throw new Error("error post fetch")
  } 
  const post = await result.json()
  
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
