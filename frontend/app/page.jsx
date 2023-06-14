"use client";

import { useState, useEffect } from "react";
import Headers from "./components/Header";
import { Noto_Sans_Masaram_Gondi } from "next/font/google";

function HomePage() {
  return (
    <div>
      <Headers />
      <MakePost />
      <GetPosts />
    </div>
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
  );
}

function GetPosts() {
  const [posts, setPosts] = useState([]);
  const [semi_private, setSemi_private] = useState([]);
  const [private_posts, setPrivate_posts] = useState([]);
  const [comments, setComments] = useState([]);
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
          setPosts(data.posts);
          setSemi_private(data.semi_private_posts);
          setPrivate_posts(data.private_posts);
          console.log(data);
        } else {
          console.log(data);
          ("fuck you");
        }
      });
  }, []);

  const handleGetComments = (postId) => {
    console.log("hello", postId);
    fetch("http://localhost:8080/api/getComments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postId),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status === "success") {
          console.log(data);
          setComments(data.comments);
        } else {
          console.log("failed to get comments", data);
        }
      });
  };

  // handle the click onto the post sections by privacy

  const handlePublicClick = () => {
    if (!display.private && !display.semi) {
      setDisplay({ public: true, semi: true, private: true });
    } else {
      setDisplay({ public: true, semi: false, private: false });
    }
  };

  const handleSemiClick = () => {
    if (!display.private && !display.public) {
      setDisplay({ public: true, semi: true, private: true });
    } else {
      setDisplay({ public: false, semi: true, private: false });
    }
  };

  const handlePrivateClick = () => {
    if (!display.public && !display.semi) {
      setDisplay({ public: true, semi: true, private: true });
    } else {
      setDisplay({ public: false, semi: false, private: true });
    }
  };
  return (
    <>
      <div className="groupeOfButtons">
        <button
          className="buttonPublic"
          style={{ background: buttonColor.public }}
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
          style={{ background: buttonColor.semi }}
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
          style={{ background: buttonColor.private }}
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

      {display.public && (
        <PublicPosts handleGetComments={handleGetComments} posts={posts} />
      )}
      {display.semi && (
        <SemiPosts handleGetComments={handleGetComments} semi={semi_private} />
      )}
      {display.private && (
        <PrivatePosts
          handleGetComments={handleGetComments}
          private_posts={private_posts}
        />
      )}
    </>
  );
}

const PublicPosts = ({ posts, handleGetComments }) => {
  return (
    <div className="public">
      <div className="mfposts">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <div className="postDate">Public | {post.creation_date}</div>
            <div className="postUser">{post.author}</div>
            <div className="postTitle">{post.title}</div>
            <div className="postContent">{post.content}</div>
            <button
              className="buttonComment"
              onClick={() => handleGetComments(post.post_id)}
            >
              comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SemiPosts = ({ semi, handleGetComments }) => {
  return (
    <div className="semi">
      <div className="mfsemi">
        {semi &&
          semi.map((semi, index) => (
            <div key={index} className="post">
              <div className="postDate">
                Semi-Private | {semi.creation_date}
              </div>
              <div className="postUser">{semi.author}</div>
              <div className="postTitle">{semi.title}</div>
              <div className="postContent">{semi.content}</div>
              <button
                className="buttonComment"
                onClick={() => handleGetComments(semi.post_id)}
              >
                comment
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

const PrivatePosts = ({ private_posts, handleGetComments }) => {
  return (
    <div className="private">
      <div className="mfprivate">
        {private_posts &&
          private_posts.map((private_post, index) => (
            <div key={index} className="post">
              <div className="postDate">
                Private | {private_post.creation_date}
              </div>
              <div className="postUser">{private_post.author}</div>
              <div className="postTitle">{private_post.title}</div>
              <div className="postContent">{private_post.content}</div>
              <button
                className="buttonComment"
                onClick={() => handleGetComments(private_post.post_id)}
              >
                comment
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
