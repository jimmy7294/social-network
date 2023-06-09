"use client"

import { useState, useEffect } from "react";


function GetPosts(){
  const [posts, setPosts] = useState([]);
  const [semi_private, setSemi_private] = useState([]);
  const [private_posts, setPrivate_posts] = useState([]);
  useEffect(() => {
  fetch("http://localhost:8080/api/getPosts",{
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => data.json())
  .then(data => {
    if (data.status == "success"){
      setPosts(data.posts);
      setSemi_private(data.semi_private_posts);
      setPrivate_posts(data.private_posts);
      console.log(data)
    } else {
      console.log(data)
      "fuck you"
    }
    })
  }, []);
 return (
<>
<div className="mfposts">
  <h2>this is public post section</h2>
{posts.map((post, index) => (
  <div key={index}>
<p> {post.author}</p>
<p> {post.title}</p>
<p> {post.content}</p>
<p> {post.creation_date}</p>
    </div>
    

))}
      </div>  


      <div className="mfsemi">
        <h2>this is semi post section</h2>
{semi_private.map((semi, index) => (
  <div key={index}>
<p> {semi.author}</p>
<p> {semi.title}</p>
<p> {semi.content}</p>
<p> {semi.creation_date}</p>
    </div>
    

))}
</div>


      <div className="mfprivate">
        <h2>this is private post section</h2>
{private_posts.map((post, index) => (
  <div key={index}>
<p> {post.author}</p>
<p> {post.title}</p>
<p> {post.content}</p>
<p> {post.creation_date}</p>
    </div>
    

))}
</div>
</>
  )
  
}

function HomePage() {

  return (
    <div>
      <h1>Meow meow meow</h1>
      <GetPosts />
    </div>
  )

}

export default HomePage      