"use client"
import React, { useState, useEffect, use } from "react";
import Link from "next/link";



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
        <div className="chatpage">
            <h2>Chat</h2>
            {users.length > 0 && (
                <div className="chatpage__users">
                    {users.map((user,index) => (
                        <div key={index} className="chatpage__user">
                        <h1><Link href={`/chat/${user.username}`}>{user.username}</Link></h1>
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
        <AllChats />
        </>
    )
}


export default chatpage;