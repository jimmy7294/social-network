"use client";

import { useState, useEffect, use } from "react";
import Headers from "./components/Header";
import {useRouter} from "next/navigation";
import encodeImageFile from "./components/encodeImage";
import GetYourImages from "./components/GetYourImages";
import ImageSelector from "./components/imageSelector";

const datapromise = GetYourImages()

function HomePage() {
  //const img = await GetYourImages()
  const img = use(datapromise)
  console.log("images from top", img)
  return (
    <>
      <Headers />
      <MakePost userImages={img}/>
      <GetPosts />
    </>
  );
}



function MakeComment(post_id){


const [allImages, setAllImages] = useState([]);
  const [image, setImage] = useState("")
  const [content, setContent] = useState("");
  const [showImages, setShowImages] = useState(false);


  useEffect (() => {
    (async () => {
      const images = await GetYourImages()
      setAllImages(images)
    })()
  },[])



  const handleCommentSubmit = async () => {
  
    fetch("http://localhost:8080/api/addComment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id, content, image }),
      })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("failed to add comment", data);
          return;
        }
        console.log("added comment", data);
      }
    );
  };
  return (
    <>
      <div className="makeComment">
      {image === "" ? (
          <h3>no selected image</h3>
        ):(
          <img src={image} className="avatar_preview"></img>
        )}
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="content"
            className="commentContentCreation"
            onChange={(e) => setContent(e.target.value)}
          />
          {showImages ? (
                <>
                <button onClick={() => setShowImages(false)}>
                  X
                </button>
                <ImageSelector images={allImages} func={setImage}/>
                </>
              ):(
            
                <button className="" onClick={() => setShowImages(true)}>
                  Select Image
                </button>
              )}
          <button type="submit" className="commentCreationButton">
            submit
          </button>
        </form>
        <form onSubmit={encodeImageFile}>
            <input type="file" id="image" name="image"></input>
            <button type="submit" className="text">AddImage</button>
            </form>
      </div>
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
     <MakeComment post_id={post_id}/>
        </div>
        
      )}
      {showMore && !comments && <div>no comments
      <MakeComment post_id={post_id}/>
        </div>}

      
    </>
  );
}


function MakePost({userImages}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [allowed_users, setAllowed] = useState([]);
  const [allImage, setAllImage] = useState(userImages);
  const[users,setUsers] = useState([])
  const [image, setimage] = useState();
  const type = "post"
  const [showImages, setShowImages] = useState(false);
  //const router = useRouter();
  const [router, setRouter] = useState(useRouter())
  console.log(allImage, "lsuadhoashd")

/*   useEffect( ()  =>  {
//    async () => {
    const images = GetYourImages()
    setAllImage(images.user_images)
    console.log("images",images)
//    }
  },[]) */



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(allowed_users, "fucked")
console.log(image, {type,privacy,allowed_users,image,content,title})
    const res = await fetch("http://localhost:8080/api/addPost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({type,privacy,allowed_users,image,content,title}),
    });
    const data = await res.json();
    if (data.status !== "success") {
      console.log("failed to make post");
      return;
    }
    console.log("success");
    location.reload('/')
  };

  
  

  const handlePrivacyChange = async (e) => {
    console.log("fuckedifuck")
    console.log(e)
    setPrivacy(e);
    if (e === "semi-private") {
      const res = await fetch("http://localhost:8080/api/getUsernames", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status !== "success") {
        console.log("failed to get users");
        return;
      }
      setUsers(data.users);
    }
  
    
  };
  const AddToAllowed = (e) => {
    console.log(e.target.checked, "lkusdhfksdhafljkhdsajlkfhljsadfhjlkashljkdfhljksadljkflhjkas")
    if(e.target.checked){
    setAllowed(allowed_users => [...allowed_users, e.target.value]);
  } else {
    setAllowed(oldArray => oldArray.filter(allowed_users => allowed_users !== e.target.value))
  }
  }
 
  return (
    <>
      <div className="makePost">
        {image === "" ? (
          <h3>no selected image</h3>
        ):(
          <img src={image} className="avatar_preview"></img>
        )}
        <form 
        onSubmit={handleSubmit}>
          <input
            className="titleCreation"
            type="text"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="dropdown"
            placeholder="private"
            onChange={(e) => handlePrivacyChange(e.target.value)}
          >
            {/*your job*/}
            <option value="public">Public</option>
            <option value="semi-private">Semi-Private</option>
            <option value="private">Private</option>
          </select>
          {privacy === "semi-private" && (
            <ul>
            
          
              {users.map((user,index) => (
                <li key={index}>
                
                <input type="checkbox" key={index} value={user.username} onChange={e => AddToAllowed(e)} />
                <label>{user.username}</label>
                </li>

              ))}

            </ul>
          )}

{/* allImage.map((image,index) => (
  <div key={index}>
    <img src={image} alt="image" className="pfp" onClick={() => setimage(image)} />
  </div>

))   */
}
          <textarea
            type="text"
            placeholder="content"
            className="postContentCreation"
            onChange={(e) => setContent(e.target.value)}
          />
          <br />
          <button type="submit" className="postCreationButton">
            submit
          </button>
        </form>
        <div className="imagePoster">
            <form onSubmit={encodeImageFile}>
            <input type="file" id="image" name="image"></input>
            <button type="submit" className="text">AddImage</button>
            </form>
            {showImages ? (
                <>
                <button onClick={() => setShowImages(false)}>
                  X
                </button>
                <ImageSelector images={allImage} func={setimage}/>
                </>
              ):(
            
                <button className="" onClick={() => setShowImages(true)}>
                  Select Image
                </button>
              )}
            </div>
      </div>
    </>
  );
}

function GetPosts() {
  const [public_posts, setPublic_posts] = useState([]);
  const [semi_privacys, setSemi_privacys] = useState([]);
  const [privacys, setPrivacys] = useState([]);
  const [display, setDisplay] = useState({
    public: true,
    semi: true,
    private: true,
  });

  const [buttonColor, setButtonColor] = useState({
    public: "#144b56",
    semi: "#144b56",
    private: "#144b56",
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
        if (data.status !== "success") {
          console.log("failed to get posts");
        } 
        console.log(data, "data here")
        setPublic_posts(data.posts);
        setSemi_privacys(data.semi_private_posts);
        setPrivacys(data.private_posts);
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
              public: display.public ? "#4faa92" : "#144b56",
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
              semi: display.semi ? "#4faa92" : "#144b56",
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
              private: display.private ? "#4faa92" : "#144b56",
            }));
          }}
        >
          Private
        </button>
      </div>
      <div className="posts">
        {display.public && <PublicPosts posts={public_posts}></PublicPosts>}
        {display.semi && <SemiPosts posts={semi_privacys}></SemiPosts>}
        {display.private && <PrivatePosts posts={privacys}></PrivatePosts>}
      </div>
    </>
  );
}

// PublicPosts component
function PublicPosts({ posts }) {
  console.log(posts)
  return (
    <>
    <div className="public">
      <div className="mfposts">
        {posts.map((post) => (
          <div key={post.post_id} className="post">
            <div className="postDate">Public | {post.creation_date}</div>
          <a className="link-up" href={`profile/${post.author}`}>
            <div className="postUser">{post.author}</div>
            </a>

            <div className="postTitle">{post.title}</div>
            <div className="postContent">{post.content}
            {post.image !== null && post.image !== "http://localhost:8080/images/default.jpeg" && post.image !== "" && <img src={post.image} alt="image" className="postImage" />
            }
            </div>
            <ToggleComments post_id={post.post_id}></ToggleComments>
          </div>
        ))}
         
      </div>
    </div>
    </>
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
              <div className="postContent">{semi.content}
              {semi.image !== null && semi.image !== "http://localhost:8080/images/default.jpeg" && semi.image !== "" && <img src={semi.image} alt="image" className="postImage" />
            }
              </div>
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
          posts.map((privacy, index) => (
            <div key={index} className="post">
              <div className="postDate">
                Private | {privacy.creation_date}
              </div>
              <a className="link-up" href={`profile/${privacy.author}`}>
              <div className="postUser">{privacy.author}</div>
              </a>
              <div className="postTitle">{privacy.title}</div>
              <div className="postContent">{privacy.content}
              {privacy.image !== null && privacy.image !== "http://localhost:8080/images/default.jpeg" && privacy.image !== "" && <img src={privacy.image} alt="image" className="postImage" />
            }
              </div>
              <ToggleComments post_id={privacy.post_id}></ToggleComments>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HomePage;