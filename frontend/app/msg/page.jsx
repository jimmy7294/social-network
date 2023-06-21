"use client"

import React, { useEffect, useState } from "react"
import Headers from "../components/Header";



function getAllConversations() {
    const [convos, setConvos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/getAllConversations", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.status !== "success") {
                    console.log("failed to get all conversations");
                    return;
                }
                setConvos(data.convos);
            });
    }, []);
    return (
        <>
            <div>
                {convos.map((convo, index) => {
                    <div key={index}>
                        <a href={`/messages/${convo.id}`}>
                            <h1>{convo.name}</h1>
                        </a>
                    </div>
                })}
            </div>
        </>
    )
}

function allConversations() {
    return (
        <>
            <Headers />
        <getAllConversations />
        </>
    )
}

export default allConversations