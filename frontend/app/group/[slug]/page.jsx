"use client";

import  { useState, useEffect } from "react";


function GetGroupPage(slug){
    const user = decodeURIComponent(slug.params.slug)
    const [groupPage, setGroupPage] = useState(null)
    console.log(user)

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
                console.log("get group page success", data)
                setGroupPage(data)
            }
        )
    }, []);
    console.log("group page", groupPage)
}

export default GetGroupPage;