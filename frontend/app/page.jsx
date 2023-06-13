"use client"

import { useState, useEffect } from "react";
import Headers from "./components/Header"


function HomePage() {

  return (
    <div>
      <Headers />
      <MakePost />
      <GetPosts />
    </div>
  )

}


function MakePost(){
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [private_post, setPrivate_post] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/makePost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, private_post }),
    });
    const data = await res.json();
    if (data.status !== "success") {
      console.log("failed to make post");
      return;
    }
    console.log("success");
  };
  return(
    <>
    <div className="makePost">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="content"
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="private"
          onChange={(e) => setPrivate_post(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </div>
    </>
  )
}



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
<div className="groupeOfButtons">
<button className="buttonPublic" onClick={function() {
    if (document.querySelector(".private").style.display == "none" && document.querySelector(".semi").style.display == "none") {
    document.querySelector(".public").style.display = "block";
    document.querySelector(".private").style.display = "block";
    document.querySelector(".semi").style.display = "block";

    document.querySelector(".buttonPublic").style.background = "#4faa92";
    document.querySelector(".buttonSemi").style.background = "#4faa92";
    document.querySelector(".buttonPrivate").style.background = "#4faa92";
    } else {
    document.querySelector(".public").style.display = "block";
    document.querySelector(".private").style.display = "none";
    document.querySelector(".semi").style.display = "none";

    document.querySelector(".buttonPublic").style.background = "#144b56";
    document.querySelector(".buttonSemi").style.background = "#4faa92";
    document.querySelector(".buttonPrivate").style.background = "#4faa92";
  }
}}>Public</button>

<button className="buttonSemi" onClick={function() {
  if (document.querySelector(".private").style.display == "none" && document.querySelector(".public").style.display == "none") {
    document.querySelector(".public").style.display = "block";
    document.querySelector(".private").style.display = "block";
    document.querySelector(".semi").style.display = "block";

    document.querySelector(".buttonPublic").style.background = "#4faa92";
    document.querySelector(".buttonSemi").style.background = "#4faa92";
    document.querySelector(".buttonPrivate").style.background = "#4faa92";
    } else {
    document.querySelector(".semi").style.display = "block";
    document.querySelector(".public").style.display = "none";
    document.querySelector(".private").style.display = "none";

    document.querySelector(".buttonPublic").style.background = "#4faa92";
    document.querySelector(".buttonSemi").style.background = "#144b56";
    document.querySelector(".buttonPrivate").style.background = "#4faa92";
    }
}}>Semi</button>

<button className="buttonPrivate" onClick={function() {
  if (document.querySelector(".public").style.display == "none" && document.querySelector(".semi").style.display == "none") {
    document.querySelector(".public").style.display = "block";
    document.querySelector(".private").style.display = "block";
    document.querySelector(".semi").style.display = "block";

    document.querySelector(".buttonPublic").style.background = "#4faa92";
    document.querySelector(".buttonSemi").style.background = "#4faa92";
    document.querySelector(".buttonPrivate").style.background = "#4faa92";
    } else {
    document.querySelector(".private").style.display = "block";
    document.querySelector(".semi").style.display = "none";
    document.querySelector(".public").style.display = "none";

    document.querySelector(".buttonPublic").style.background = "#4faa92";
    document.querySelector(".buttonSemi").style.background = "#4faa92";
    document.querySelector(".buttonPrivate").style.background = "#144b56";
    }
}}>Private</button>
</div>
<div className="public">
<div className="mfposts">
{posts.map((post, index) => (
  <div key={index} className="post">
<div className="postDate">Public | {post.creation_date}</div>
<div className="postUser">{post.author}</div>
<div className="postTitle">{post.title}</div>
<div classeName="postContent">{post.content}</div>
<button className="buttonComment" onClick={function() {}}>comment</button>
    </div>
))}
</div>
</div>
<div className="semi">
      <div className="mfsemi">
{semi_private && semi_private.map((semi, index) => (
  <div key={index} className="post">
<div className="postDate">Semi-Private | {semi.creation_date}</div>
<div className="postUser">{semi.author}</div>
<div className="postTitle">{semi.title}</div>
<div classeName="postContent">{semi.content}</div>
<button className="buttonComment" onClick={function() {}}>comment</button>
    </div>
))}
</div>
</div>
<div className="private">
      <div className="mfprivate">
{private_posts && private_posts.map((post, index) => (
  <div key={index} className="post">
<div className="postDate">Private | {post.creation_date}</div>
<div className="postUser">{post.author}</div>
<div className="postTitle">{post.title}</div>
<div classeName="postContent">{post.content}</div>
<button className="buttonComment" onClick={function() {}}>comment</button>
    </div>
))}
</div>
</div>
</>
  )
  
}

export default HomePage      