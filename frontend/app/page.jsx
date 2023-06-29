"use client";

import { useState, useEffect } from "react";
import Headers from "./components/Header";


function HomePage() {
  return (
    <>
      <Headers />
      <MakePost />
      <GetPosts />
    </>
  );
}

function ToggleComments({ post_id }) {
  const [showMore, setShowMore] = useState(false);
  const [comments, setComments] = useState([]);
  function handleClick() {
    fetch("http://localhost:8080/api/getComments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post_id),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("failed to get comments", data);
        }
        console.log(data);
        setComments(data.comments);
        setShowMore(!showMore);
      });
  }
  return (
    <>
      <button className="buttonComment" onClick={handleClick}>
        comments
      </button>
      {showMore && comments && (
        <div className="commentos">
          {comments.map((dat, index) => (
            <div key={index} className="commenting">
              
              <div className="commentDate">{dat.created}</div>
              <a href={`profile/${dat.author}`} >
              <div className="commentUser">{dat.author}</div>
              </a>
              <div className="commentContent">{dat.content}</div>
            </div>
          ))}
        </div>
      )}
      {showMore && !comments && <div>no comments</div>}
    </>
  );
}

function MakePost() {
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
  return (
    <>
      <div className="makePost">
        <form onSubmit={handleSubmit}>
          <input
            className="titleCreation"
            type="text"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="dropdown"
            placeholder="private"
            onChange={(e) => setPrivate_post(e.target.value)}
          >
            {/*your job*/}
            <option value="">Public</option>
            <option value="">Semi-Private</option>
            <option value="">Private</option>a
          </select>
          <textarea
            type="text"
            placeholder="content"
            className="postContentCreation"
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="postCreationButton">
            submit
          </button>
        </form>
      </div>
    </>
  );
}

function GetPosts() {
  const [public_posts, setPublic_posts] = useState([]);
  const [semi_private_posts, setSemi_private_posts] = useState([]);
  const [private_posts, setPrivate_posts] = useState([]);
  const [display, setDisplay] = useState({
    public: true,
    semi: true,
    private: true,
  });

  const [buttonColor, setButtonColor] = useState({
    public: "#4faa92",
    semi: "#4faa92",
    private: "#4faa92",
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/getPosts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status == "success") {
          setPublic_posts(data.posts);
          setSemi_private_posts(data.semi_private_posts);
          setPrivate_posts(data.private_posts);
          console.log(data);
        } else {
          console.log(
            "Error fetching data from http://localhost:8080/api/getPosts",
            data
          );
        }
      });
  }, []);

  return (
    <>
      <div className="groupeOfButtons">
        <button
          className="buttonPublic"
          style={{ backgroundColor: buttonColor.public }}
          onClick={() => {
            setDisplay((prevState) => ({
              ...prevState,
              public: !prevState.public,
            }));
            setButtonColor((prevColor) => ({
              ...prevColor,
              public: display.public ? "#144b56" : "#4faa92",
            }));
          }}
        >
          Public
        </button>

        <button
          className="buttonSemi"
          style={{ backgroundColor: buttonColor.semi }}
          onClick={() => {
            setDisplay((prevState) => ({
              ...prevState,
              semi: !prevState.semi,
            }));
            setButtonColor((prevColor) => ({
              ...prevColor,
              semi: display.semi ? "#144b56" : "#4faa92",
            }));
          }}
        >
          Semi
        </button>

        <button
          className="buttonPrivate"
          style={{ backgroundColor: buttonColor.private }}
          onClick={() => {
            setDisplay((prevState) => ({
              ...prevState,
              private: !prevState.private,
            }));
            setButtonColor((prevColor) => ({
              ...prevColor,
              private: display.private ? "#144b56" : "#4faa92",
            }));
          }}
        >
          Private
        </button>
      </div>
      <div className="posts">
        {display.public && <PublicPosts posts={public_posts}></PublicPosts>}
        {display.semi && <SemiPosts posts={semi_private_posts}></SemiPosts>}
        {display.private && <PrivatePosts posts={private_posts}></PrivatePosts>}
      </div>
    </>
  );
}

// PublicPosts component
function PublicPosts({ posts }) {
  return (
    <div className="public">
      <div className="mfposts">
        {posts.map((post) => (
          <div key={post.post_id} className="post">
            <div className="postDate">Public | {post.creation_date}</div>
          <a className="link-up" href={`profile/${post.author}`}>
            <div className="postUser">{post.author}</div>
            </a>

            <div className="postTitle">{post.title}</div>
            <div className="postContent">{post.content}</div>
            <ToggleComments post_id={post.post_id}></ToggleComments>
          </div>
        ))}
      </div>
    </div>
  );
}

// SemiPosts component
function SemiPosts({ posts }) {
  return (
    <div className="semi">
      <div className="mfsemi">
        {posts &&
          posts.map((semi, index) => (
            <div key={index} className="post">
              <div className="postDate">
                Semi-Private | {semi.creation_date}
              </div>
              <a className="link-up" href = {`profile/${semi.author}`}>
              <div className="postUser">{semi.author}</div>
              </a>
              <div className="postTitle">{semi.title}</div>
              <div className="postContent">{semi.content}</div>
              <ToggleComments post_id={semi.post_id}></ToggleComments>
            </div>
          ))}
      </div>
    </div>
  );
}

// PrivatePosts component
function PrivatePosts({ posts }) {
  return (
    <div className="private">
      <div className="mfprivate">
        {posts &&
          posts.map((private_post, index) => (
            <div key={index} className="post">
              <div className="postDate">
                Private | {private_post.creation_date}
              </div>
              <a className="link-up" href={`profile/${private_post.author}`}>
              <div className="postUser">{private_post.author}</div>
              </a>
              <div className="postTitle">{private_post.title}</div>
              <div className="postContent">{private_post.content}</div>
              <ToggleComments post_id={private_post.post_id}></ToggleComments>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HomePage;
