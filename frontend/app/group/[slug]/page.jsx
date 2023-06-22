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
                console.log(data)
                setGroup(data.group)
            })
    }, [])
    return(
        <>
        <div className="group">
            <h2>group</h2>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <p>{group.members}</p>
            <p>{group.events}</p>
        </div>
        </>
    )
}


function GroupPage(slug){
    return(
        <>
        <Headers />
        {GetGroup(slug)}
        <div className="groupPage">
            <h1>group page</h1>
            {GetGroup(slug)}
            <MakeEvent />
            <GetEvents />
        </div>
        </>
    )


}

export default GetGroupPage;