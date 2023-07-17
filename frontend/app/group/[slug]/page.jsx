"use client";

import Headers from "../../components/Header";
import { useRouter } from "next/navigation";
import GetYourImages from "../../components/GetYourImages";
import encodeImageFile from "../../components/encodeImage";
import { usePathname } from "next/navigation";
//import getGroupPageData from "@/app/components/test";
import { useState, useEffect, use } from "react";
import ImageSelector from "@/app/components/imageSelector";

function AddOptionRow() {
  return (
    <>
      <div>
        <input
          type="date"
          className="mt-2"
          placeholder="event date"
          onChange={(e) => setEvent_Date(e.target.value)}
        />
      </div>
    </>
  );
}

async function addMemberToGroupChat(slug) {
  if (slug === undefined) return "not_yet";
  const groupName = decodeURIComponent(slug.params.slug);

  const json = await fetch("http://localhost:8080/api/addGroupMemberToChat", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupName),
  });
  const data = await json.json();
  return data.status;
}

async function getGroupPageData(slug) {
  console.log("slug", slug);
  if (slug === undefined) return "not_a_member";
  const groupname = decodeURIComponent(slug.params.slug);
  const json = await fetch("http://localhost:8080/api/getGroupPage", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupname),
  });
  const data = await json.json();
  if (data.status !== "success") {
    console.log("error in get gorup", data.status);
    return data.status;
  }

  return data;
}

//const promisdata2 = getGroupPageData()

//const promisdata = GroupPage()
export default function GroupPage(slug) {
  const [isMember, setIsMember] = useState(false);
  const [chat, setChat] = useState();
  const [groupPageData, setGroupPageData] = useState("not_a_member");
  const [groupExists, setGroupExists] = useState(true);
  const [websocket, setWebSocket] = useState(null);
  const [notif, setNotif] = useState([]);

  useEffect(() => {
    (async () => {
      const m = await addMemberToGroupChat(slug);
      if (m !== "success") {
        if (m === "group_does_not_exist") {
          setGroupExists(false);
          return;
        }
      }
      const c = await ChatBox(slug);
      setChat(c);
      const g = await getGroupPageData(slug);
      setGroupPageData(g);
      if (g !== "not_a_member") {
        console.log("should be true");
        setIsMember(true);
        const newWS = new WebSocket("ws://localhost:8080/api/ws");
        newWS.onmessage = (msg) => {
          //console.log("new notification",msg)
          let newMsg = JSON.parse(msg.data);
          if (newMsg.type === "group_message") {
            console.log("new notification parsed", newMsg);
            setChat((prevValue) => [...prevValue, newMsg]);
            //console.log("new chat",chat)
          }
          if (
            newMsg.type === "group_join_request" ||
            newMsg.type === "group_invite"
          ) {
            console.log("new notification", newMsg);
            setNotif((prevValue) => [...prevValue, newMsg]);
          }
        };
        setWebSocket(newWS);
        return () => {
          console.log("closing websocket");
          newWS.close();
        };
      }
      if (g === "group_does_not_exist") {
        setGroupExists(false);
      }
    })();
  }, []);
  console.log("render main file");
  return (
    <>
      {isMember && groupExists ? (
        <>
          <Headers notifs={notif} />
          <MakeGroupPost slug={slug} />
          <RenderGroup data={groupPageData} slug={slug} />
          <RenderChatBox message={chat} slug={slug} websocket={websocket} />
        </>
      ) : groupExists ? (
        <>
          <Headers notifs={notif} />
          <RenderGroup data={groupPageData} slug={slug} />
        </>
      ) : (
        <>
          <Headers notifs={notif} />
          <h1>Group does not exist</h1>
        </>
      )}
    </>
  );
}

function RenderGroup(props) {
  const data = props.data;
  const slug = props.slug;
  console.log("render group slug", slug);
  const [groupPosts, setGroupPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [joinRequest, setJoinRequest] = useState([]);
  const [userType, setUserType] = useState("");
  const [isMember, setIsMember] = useState(false);
  const groupname = decodeURIComponent(slug.params.slug);

  useEffect(() => {
    if (data !== "not_a_member") {
      setGroupPosts(data.group_posts);
      setEvents(data.events);
      setMembers(data.members);
      setJoinRequest(data.join_request);
      setUserType(data.member_type);
      setIsMember(true);
    } else {
      setUserType("not_a_member");
      setIsMember(false);
    }
  }, []);

  return (
    <>
      <div>
        {isMember ? (
          <div className="groupPage">
            <h1>{groupname}</h1>

            {groupPosts && (
              <div className="container">
                {groupPosts.map((post, index) => (
                  <div className="groupPost" key={index}>
                    <div className="postti">
                      <div className="poster">
                        <h2>{post.author}</h2>
                      </div>
                      <img
                        className="avatar_preview"
                        src={post.image}
                        alt="post image"
                      />
                      <div className="contents">
                        <p>{post.content}</p>
                        <p>{post.creation_date}</p>
                      </div>
                      {/* <MakeComment post_id={post.post_id}></MakeComment> */}
                      <ToggleComments
                        post_id={post.post_id}
                        group_name={groupname}
                      ></ToggleComments>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {members.username && (
              <div>
                {members.username && members.username.length == 1 && (
                  <div>
                    <h1>Members</h1>
                    <p>{members.username}</p>
                  </div>
                )}
                {members.map((member, index) => (
                  <div className="groupMember" key={index}>
                    <div className="groupMemberInfo">
                      <h2>{member.username}</h2>
                      <h1> {member.member_type}</h1>
                    </div>

                    <div className="groupMemberInfo">
                      <h2>{member.email}</h2>
                      <h1> {member.member_type}</h1>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h2>Event page</h2>
            <MakeEvent slug={slug} />
            {/* MakeEvent(slug) */}
            {events && (
              <div className="container">
                {events.map((event, index) => (
                  <div className="groupEvent" key={index}>
                    <div className="groupPost">
                      <div className="postti">
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>

                        <div className="contents">
                          <p>{event.date}</p>
                          <p>{event.event_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {joinRequest && (
              <div className="container">
                {joinRequest.map((request, index) => (
                  <div className="groupPost" key={index}>
                    {request && (
                      <div className="postti">
                        <h2>{request.username}</h2>
                        <h1>{request.email}</h1>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {userType === "creator" && (
              <div className="container">
                <h1>Join Requests</h1>
                {joinRequest && (
                  <div>
                    {joinRequest.map((request, index) => (
                      <div className="groupJoinRequest" key={index}>
                        {request && (
                          <div className="groupJoinRequestInfo">
                            <h2>{request.username}</h2>
                            <h1>{request.email}</h1>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <h2>{groupname}</h2>
            <button onClick={() => RequestToJoin(slug)}>Request to join</button>
          </>
        )}
      </div>
    </>
  );
}

function RenderChatBox(props) {
  const message = props.message;
  const websocket = props.websocket;
  const groupName = decodeURIComponent(props.slug.params.slug);
  console.log("render chat box", message, groupName);
  const [messages, setMessages] = useState([]);
  function handleSubmit(event) {
    event.preventDefault();
    const msg = event.target.chat.value;
    websocket.send(
      JSON.stringify({
        receiver: groupName,
        content: msg,
        type: "group_message",
      })
    );
    event.target.chat.value = "";
  }
  useEffect(() => {
    setMessages(message);
  }, [message]);
  //setMessages(message)

  return (
    <>
      <div className="messageBox">
        <h1 className="title">Chat</h1>
        <div className="chat">
          <div className="autoScroll">
            {messages.map((messages, index) => (
              <div className="messages" key={index}>
                <p className="lineBreak">{messages.sender}</p>
                <p className="lineBreak">{messages.content}</p>
                <p className="lineBreak">{messages.created}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <form onSubmit={handleSubmit}>
            <textarea
              type="text"
              id="chat"
              name="chat"
              className="postContentCreation"
              placeholder="message"
            />
            <button type="submit">send</button>
          </form>
        </div>
      </div>
    </>
  );
}

async function ChatBox(slug) {
  if (slug === undefined) {
    return;
  }
  //console.log("cookies???", NextResponse.cookies)
  //console.log("cok", NextPageContext)
  // const [message, setMessage] = useState([]);
  const groupname = decodeURIComponent(slug.params.slug);
  const json = await fetch("http://localhost:8080/api/getGroupChat", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupname),
  });
  const response = await json.json();
  if (response.status === "success") {
    console.log("dsak");
    return response.messages;
  }
  console.log("failed to get chat");
  return;
}
/*         .then((data) => data.json())
        .then((data) => {
            if (data.status !== "success"){
                console.log("failed to get chat")
                return
            }
            console.log(data)
            console.log("got chat")
            return data.messages
            //etMessage(data.messages)
        }) */

/*     return(
    <>
   
        {message.map((message, index) => (
            <div key={index}>
                <p>{message.username}</p>
                <p>{message.message}</p>
                <p>{message.time}</p>
            </div>
        
        ))}

   

    <div className="chatBox">
        <h1>ChatBox</h1>
        <input type="text" placeholder="message"/>
        <button>send</button>
    </div>
    </>
    )
}
 */

function MakeGroupPost(props) {
  const slug = props.slug;
  const group_name = decodeURIComponent(slug.params.slug);
  const type = "group_post";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [allImage, setAllImage] = useState([]);
  const [showImages, setShowImages] = useState(false);
  //const pathname = usePathname()
  //const router = useRouter();

  useEffect(() => {
    (async () => {
      const images = await GetYourImages();
      setAllImage(images);
    })();
  }, []);

  const SubmitHandle = async (e) => {
    fetch("http://localhost:8080/api/addPost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_name, title, content, type, image }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("failed to add post", data);
          return;
        }
        console.log("added post", data);
      });
  };
  return (
    <>
      <div>
        {image === "" ? (
          <h3>no selected image</h3>
        ) : (
          <img src={image} className="avatar_preview"></img>
        )}
        <form onSubmit={encodeImageFile}>
          <input type="file" id="image" name="image"></input>
          <button type="submit" className="text">
            Add Image
          </button>
        </form>
      </div>
      <div>
        <form className="groupPostmaker" onSubmit={SubmitHandle}>
          <input
            className="titleCreation"
            type="text"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="postContentCreation"
            type="text"
            placeholder="content"
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">submit</button>
        </form>
        {showImages ? (
          <>
            <button onClick={() => setShowImages(false)}>X</button>
            <ImageSelector images={allImage} func={setImage} />
          </>
        ) : (
          <button className="" onClick={() => setShowImages(true)}>
            Select Image
          </button>
        )}
      </div>
    </>
  );
}

function MakeEvent({ slug }) {
  const router = useRouter();
  const group_name = decodeURIComponent(slug.params.slug);
  const [title, setEventTitle] = useState("");
  const [content, setContent] = useState("");
  const [event_date, setEvent_Date] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(group_name);
    fetch("http://localhost:8080/api/addEvent", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_name, title, content, event_date }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("failed to add event", data);
          return;
        }
        console.log(data);
      });
    location.reload();
  };
  return (
    <>
      <div className="signin-window">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="event title"
            className="mt-2"
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <textarea
            type="text"
            className="postContentCreation"
            placeholder="event description"
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="date"
            className="mt-2"
            placeholder="event date"
            onChange={(e) => setEvent_Date(e.target.value)}
          />

          <button type="submit">submit</button>
        </form>
      </div>
    </>
  );
}

function RequestToJoin(slug) {
  const group_name = decodeURIComponent(slug.params.slug);
  fetch("http://localhost:8080/api/sendGroupJoinRequest", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_name }),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log(data.status);
        console.log("request to join failed");
        return;
      }
      console.log("request to join success");
    });
}

/* function GetGroupPage({slug}){
    console.log("sllluuugggg",slug)
    const groupname = decodeURIComponent(slug.params.slug)
  const [groupPosts, setGroupPosts] = useState([])
  const [events, setEvents] = useState([])
  const [members , setMembers] = useState([])
    const [joinRequest, setJoinRequest] = useState([])
    const [userType, setUserType] = useState("")

    useEffect(() => {
        fetch("http://localhost:8080/api/getGroupPage", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
                },  
                body: JSON.stringify(groupname),
            })
            .then((data) => data.json())
            .then((data) => {
             if (data.status === "success"){
                setGroupPosts(data.group_posts)
                setEvents(data.events)
                setMembers(data.members)
                setJoinRequest(data.join_request)
                setUserType(data.member_type)
                console.log(data)
             } else {
                setUserType("not_a_member")
             }
            })
    
    }, []);
    if(userType === "not_a_member"){
        return(
            <>
            <h2>{groupname}</h2>
            <button onClick={RequestToJoin(slug)}>Request to join</button>
        </>

        )
    }
    return(
        <>
        <div className="groupPage">
            <h1>{groupname}</h1>
           
            {groupPosts &&
            <div className="container">
            {groupPosts.map((post,index) => (
                <div className="groupPost" key={index}>
                    
                    <div className="postti">
                        <div className="poster">
                    <img className="pfp" src={post.image} alt="post image" />
                    <h2>{post.author}</h2>
                        </div>
                        <div className="contents">
                    <p>{post.content}</p>
                    <p>{post.creation_date}</p>
                        </div>
                        <MakeComment post_id={post.post_id}></MakeComment>
                        <ToggleComments post_id={post.post_id}></ToggleComments>
                    </div>

                </div>
                    
            ))}
            </div>
            }
            {members.username&& 
            <div>
                {members.username && (members.username.length == 1) &&
              
                <div>
                    <h1>Members</h1>
                    <p>{members.username}</p>
                </div>
} 

            
            {members.map((member,index) => (
                <div className="groupMember" key={index}>
                    
                    <div className="groupMemberInfo">
                    <h2>{member.username}</h2>
                    <h1> {member.member_type}</h1>
                    </div>

                    <div className="groupMemberInfo">
                    <h2>{member.email}</h2>
                    <h1> {member.member_type}</h1>
                    </div>
                </div>
            ))}
            </div>
            }
                <h2>Event page</h2>
                <MakeEvent slug={slug} />
            {events&&
              
            <div className="container">

            {events.map((event,index) => (
                <div className="groupEvent" key={index}>
                    
                    <div className="groupPost">
                    <div className="postti">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                       
                        <div className="contents">
                    <p>{event.date}</p>
                    <p>{event.event_date}</p>
                        </div>
                    </div>
                    </div>
                </div>
            ))}
            </div>
            }
            {joinRequest &&
            <div className="container">

            {joinRequest.map((request,index) => (
                <div className="groupPost" key={index}>
                    {request&&
                    <div className="postti">
                    <h2>{request.username}</h2>
                    <h1>{request.email}</h1>
                    </div>
                    }
                </div>
            ))}
            </div>
            }

            {userType === "creator" &&
            <div className="container">
                <h1>Join Requests</h1>
                {joinRequest &&
                <div>
                    {joinRequest.map((request,index) => (
                        <div className="groupJoinRequest" key={index}>
                            {request&&
                            <div className="groupJoinRequestInfo">
                                <h2>{request.username}</h2>
                                <h1>{request.email}</h1>
                                </div>
                            }
                        </div>
                    ))}
                </div>
                }
            </div>
            }
    </div>
        </>
    )
} */

function MakeComment(props) {
  const post_id = props.post_id;
  const group_name = props.group_name;
  const [image, setImage] = useState("");
  const [allImage, setAllImage] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [content, setContent] = useState("");
  const post_type = "group_post";

  useEffect(() => {
    (async () => {
      const images = await GetYourImages();
      setAllImage(images);
    })();
  }, []);

  const handleCommentSubmit = async (e) => {
    /*  e.preventDefault() */
    fetch("http://localhost:8080/api/addComment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id, content, image, post_type, group_name }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "success") {
          console.log("failed to add comment", data);
          return;
        }
        console.log("added comment", data);
      });
  };
  return (
    <>
      <div className="makeComment">
        {image === "" ? (
          <h3>no selected image</h3>
        ) : (
          <img src={image} className="avatar_preview"></img>
        )}

        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="content"
            className="commentContentCreation"
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="commentCreationButton">
            submit
          </button>
        </form>
        {showImages ? (
          <>
            <button onClick={() => setShowImages(false)}>X</button>
            <ImageSelector images={allImage} func={setImage} />
          </>
        ) : (
          <button className="" onClick={() => setShowImages(true)}>
            Select Image
          </button>
        )}
        <form onSubmit={encodeImageFile}>
          <input type="file" id="image" name="image"></input>
          <button type="submit" className="text">
            AddImage
          </button>
        </form>
      </div>
    </>
  );
}

function ToggleComments(props) {
  const post_id = props.post_id;
  const group_name = props.group_name;
  const [showMore, setShowMore] = useState(false);
  const [comments, setComments] = useState([]);
  const type = "group_comments";
  function handleClick() {
    fetch("http://localhost:8080/api/getComments", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id, type, group_name }),
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
              <a href={`profile/${dat.author}`}>
                <div className="commentUser">{dat.author}</div>
              </a>
              <div className="commentContent">{dat.content}</div>
            </div>
          ))}
          <MakeComment post_id={post_id} group_name={group_name} />
        </div>
      )}
      {showMore && !comments && (
        <div>
          no comments
          <MakeComment post_id={post_id} group_name={group_name} />
        </div>
      )}
    </>
  );
}

//export default GroupPage;
