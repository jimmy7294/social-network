"use client";

import  { useState, useEffect } from "react";
import Headers from "../../components/Header";

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
             } else {
                setUserType("not_a_member")
             }
            })
    
    }, []);
    console.log(userType)
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
        {GetGroupPage(slug)}
        </>
    )


}

export default GroupPage;