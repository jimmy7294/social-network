"use client"
import React, { useState, useEffect, use } from "react";
import Headers from "../components/Header";




 function AllChats(){
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/api/getUsernames", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                },
                })
                .then((res) => res.json())
                .then((data) => {
                    if(data.status !== "success"){
                        console.log("error getting allusernames for chat",data.status)
                    }
                    console.log(data.users[0].username, "salkdjiosa")
                    setUsers(data.users)
                })
            }, []);
            console.log(users,"sakldlak")

    return(
        <>
        
        <div className="container">
            
            {users.length > 0 && (
                <div className="chatorganise">
                    <h2 className="title">Chat</h2>
                    {users.map((user,index) => (
                        <div className="user" key={index}>
                        <h1><a className="contents" href={`/chat/${user.username}`}>{user.username}</a></h1>
                        </div>
                    ))}
                </div>

            )}
        </div>

        </>
    )
}


function chatpage(){
    return(
        <>
        <Headers />
        <AllChats />
        </>
    )
}


export default chatpage;