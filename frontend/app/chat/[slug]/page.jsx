"use client";
import { useEffect, useState } from "react";
import Headers from "../../components/Header";

function currentChat(slug){
    const user = decodeURIComponent(slug.params.slug)
    return(
        <>
        <Headers />
        <h2>Chatting With {user}</h2>
        {GetMessages(slug)}
        </>
    )
}

function SendMessage(reciver){
    return(
        <>
        <textarea className="postContentCreation" type="text" placeholder="message" />
        <button type="submit">Send</button>
        </>
    )
}

export function PrintNewMessage(msg){
    return(
        <>
        <h1>{msg.sender}</h1>
        <h1>{msg.content}</h1>
        
        </>
    )
}



function GetMessages(slug){
    const user =  decodeURIComponent(slug.params.slug)
    const [messages, setMessages] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/api/getPrivateMessages", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            })
            .then((data) => data.json())
            .then((data) => {
                if(data.status !== "success"){
                    console.log("error getting messages",data.status)
                    return
                }
                console.log(data.messages)
                setMessages(data.messages)
            }
            )
    }, []);
        console.log(messages, "work")
        return(
        <>
        <div className="chatpage">
            {messages &&(
                <div className="chatpage__messages">
                    {messages.map((message,index) => (
                        <div key={index} className="chatpage__message">
                        <p>folow</p>
                        <h1>{message.content}</h1>
                        </div>
                    ))}
                </div>
            )}
            {SendMessage(user)}
        </div>
        </>
    )
}


export default currentChat; 