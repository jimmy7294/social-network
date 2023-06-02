"use client"
import Profile from "./components/Profile"
import Link from "next/link"

const PostPage = async () => {
  const result = await fetch("http://localhost:8080/api/getAllPosts", {
    method: "POST",
    headers:{
      credentials: "include",
    "Content-Type": "application/json"
    }
  }

  )
  if (!result.ok) {
    throw new Error("Error fetching posts");
  }
  const post = await result.json();
  console.log(post)

return (
<div className="post-container">
  <h1>Post Page</h1>
  <ul className="post-list">
  <li key={post.id} className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>{post.image}</p>
          <p>{post.created}</p>
          <p>{post.autor}</p>
        </li>
  </ul>
</div>
);
};



const HomePage = () => {

  return (
    <div>
      <h1>Meow meow meow</h1>
      <Profile />
    </div>
  )

}

export default HomePage      