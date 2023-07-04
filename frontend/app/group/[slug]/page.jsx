"use client";

import  { useState, useEffect } from "react";
import Headers from "../../components/Header";
import { useRouter } from "next/navigation";


function ChatBox(slug){
    const [message, setMessage] = useState([]);
    const groupname = decodeURIComponent(slug.params.slug)
    fetch("http://localhost:8080/api/getChat", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(groupname),
        })
        .then((data) => data.json())
        .then((data) => {
            if (data.status !== "success"){
                console.log("failed to get chat")
                return
            }
            console.log(data)
            console.log("got chat")
            setMessage(data.messages)
        })

    return(
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


function MakeGroupPost(slug) {
    const group_name = decodeURIComponent(slug.params.slug)
    const type = "group_post"
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const SubmitHandle = async (e) => {
    fetch("http://localhost:8080/api/addPost", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ group_name, title, content, type }),
    })
        .then((data) => data.json())
        .then((data) => {
            if (data.status !== "success") {
                console.log("failed to add post", data);
                return
            }
            console.log("added post", data);
        });
    };
    return (
        <>
        <div className="makePost">
            <form onSubmit={SubmitHandle}>
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
                <button type="submit">submit</button>
            </form>
        </div>
        </>
    );
}



function MakeEvent( slug ) {
    const router = useRouter();
    const group_name = decodeURIComponent(slug.params.slug)
    const [title, setEventTitle] = useState("");
    const [content, setContent] = useState("");
    const [event_date, setEvent_Date] = useState("");
    const [options, setOptions] = useState([]);
    const [optionone, setOptionOne] = useState("");
    const [optiontwo, setOptionTwo] = useState("");
   
    const handleSubmit = async (e) => {
        options.push(optionone);
        options.push(optiontwo);
        console.log(options)
        console.log(group_name)
         fetch("http://localhost:8080/api/addEvent",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ group_name, title, content, event_date, options }),
        })
        .then((data) => data.json())
        .then((data) => {
            if (data.status !== "success") {
                console.log("failed to add event", data);
            }
            console.log(data);
            setOptions([]); 
        });
    };
    return (
        <>
        <div className="makeEvent">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="event title"
                    onChange={(e) => setEventTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="event description"
                    onChange={(e) => setContent(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="event date"
                    onChange={(e) => setEvent_Date(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="event options"
                    onChange={(e) => setOptionOne(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="event options"
                    onChange={(e) => setOptionTwo(e.target.value)}
                />
                <button type="submit">submit</button>
            </form>
        </div>
        </>
    );
}





function RequestToJoin(slug){
    const groupname = decodeURIComponent(slug.params.slug)
    fetch("http://localhost:8080/api/requestToJoin", {
        method: "POST",
        credentials: "include", 
        headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(groupname),

        })
        .then((data) => data.json())
        .then((data) => {
            if (data.status !== "success"){
                console.log(data.status)
                console.log("request to join failed")
                return
            }
            console.log("request to join success")
        })
    }




function GetGroupPage(slug){
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
            </div>
            {groupPosts &&
            <div>
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
            {events&&
            <div>

            {events.map((event,index) => (
                <div className="groupEvent" key={index}>
                    
                    <div className="groupEventInfo">
                    <div className="postti">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                       
                        <div className="contents">
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                        </div>
                    </div>
                    </div>
                </div>
            ))}
            </div>
            }
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

            {userType === "creator" &&
            <div>
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
        </>
    )
}


function GroupPage(slug){
    return(
        <>
        <Headers />
        {MakeGroupPost(slug)}
        {MakeEvent(slug)}
        {GetGroupPage(slug)}
        {ChatBox(slug)}
        </>
    )


}

export default GroupPage;