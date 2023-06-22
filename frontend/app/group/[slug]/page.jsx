"use client";

import  { useState, useEffect } from "react";
import Headers from "../../components/Header";


function GetGroupPage(slug){
    const user = decodeURIComponent(slug.params.slug)
  const [groupPosts, setGroupPosts] = useState([])
  const [events, setEvents] = useState([])
  const [members , setMembers] = useState([])
    const [joinRequest, setJoinRequest] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/api/getGroupPage", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            })
            .then((data) => data.json())
            .then((data) => {
                if (data.status !== "success") {
                    console.log("get group page failed", data.status)
                    return
                }
                console.log(data)
                setGroupPosts(data.group_posts)
                setEvents(data.events)
                setMembers(data.members)
                setJoinRequest(data.join_request)


            })
    }, [])
    return(
        <>
        <div className="groupPage">
            <h1>{user}</h1>
            </div>
            {groupPosts &&
            <div>
            {groupPosts.map((post,index) => (
                <div className="groupPost" key={index}>
                    
                    <div className="groupPostInfo">
                    <img src={post.image} alt="post image" />
                    <h2>{post.author}</h2>
                    <p>{post.content}</p>
                    <p>{post.creation_date}</p>
                    </div>

                </div>
                    
            ))}
            </div>
            }
            {members.username&& 
            <div>
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
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p>{event.date}</p>
                    <p>{event.location}</p>
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