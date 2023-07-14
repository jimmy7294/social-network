"use client";
import { useEffect, useState } from "react";
import Headers from "../../components/Header";

export default function currentChat(slug){
    const user = decodeURIComponent(slug.params.slug)
    const [chat, setChat] = useState()
    const [websocket, setWebSocket] = useState()
    useEffect(() => {
        (async () => {
/*             const m = await addMemberToGroupChat(slug)
            if (m !== "success") {
                if (m === "group_does_not_exist") {
                    setGroupExists(false)
                    return
                }

            } */
            const c = await getChat(slug)
            setChat(c)
/*             const g = await getGroupPageData(slug)
            setGroupPageData(g) */
            if (c) {
                console.log("should be true")
                //setIsMember(true);
                const newWS = new WebSocket("ws://localhost:8080/api/ws")
            newWS.onmessage = (msg) => {
                console.log("new notification",msg)
                let newMsg = JSON.parse(msg.data)
                console.log("new notif parsed", newMsg)
                if (newMsg.type === "private_message" && (newMsg.receiver === user || newMsg.sender === user)) {
                //console.log("new notification parsed",newMsg)
                setChat((prevValue) => [...prevValue, newMsg])
                //console.log("new chat",chat)
                }
             }
             setWebSocket(newWS)
            return () => {
                console.log("closing websocket")
                newWS.close()
            }
              }
/*             if (g === "group_does_not_exist") {
                setGroupExists(false)
              } */
          })()
      }, []);

    return(
        <>
        <Headers />
        <h2>Chatting With {user}</h2>
        {/* {GetMessages(slug)} */}
        <RenderChatBox message={chat} slug={slug} websocket={websocket}/>
        </>
    )
}

function RenderChatBox(props) {
    const message = props.message
    const websocket = props.websocket
    const otherUser = decodeURIComponent(props.slug.params.slug)
    console.log("render chat box", message, otherUser)
    const [messages, setMessages] = useState([])
    function handleSubmit(event) {
        
        event.preventDefault()
        const msg = event.target.chat.value
        websocket.send(
            JSON.stringify({
              receiver: otherUser,
              content: msg,
              type: "private_message",
            })
        )
        event.target.chat.value = ""
    }
    useEffect(() => {
        setMessages(message)
      }, [message])
    //setMessages(message)

        return(
            <>
        <div className="messageBox">
              <h1 className="title" >Chat</h1>
              <div className="chat">
              <div className="autoScroll">
                {messages ? (
                    messages.map((messages, index) => (
                        <div className="messages" key={index}>
                            <p className="lineBreak">{messages.sender}</p>
                            <p className="lineBreak">{messages.content}</p>
                            <p className="lineBreak">{messages.created}</p>
                        </div>
                    
                    ))
                ) : (
                    <h1>No Messages.</h1>
                ) }
{/*                 {messages.map((messages, index) => (
                    <div className="messages" key={index}>
                        <p className="lineBreak">{messages.sender}</p>
                        <p className="lineBreak">{messages.content}</p>
                        <p className="lineBreak">{messages.created}</p>
                    </div>
                
                ))} */}
                </div>
                </div>
            <div className="chatBox">
                <form onSubmit={handleSubmit}>
                    <textarea type="text" id="chat" name="chat" className="postContentCreation" placeholder="message"/>
                    <button type="submit">send</button>
                </form>
            </div>
        </div>
            </>
            )
}

async function getChat(slug) {
    if (slug === undefined) return;

    const otherUser = decodeURIComponent(slug.params.slug)
    const json = await fetch("http://localhost:8080/api/getPrivateMessages", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(otherUser),
        })
    const response = await json.json()
    if (response.status === "success") {
        console.log("response",response)
        return response.messages
    }
    console.log("error msg", response.status)
    return response.status
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


/* export default currentChat;  */