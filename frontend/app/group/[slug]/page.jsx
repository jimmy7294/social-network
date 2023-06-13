"use client"

import React, { useEffect,useState } from "react";


function GetEvents() {
    const [events, setEvents] = useState([{}])
    useEffect(() => {
        fetch("http://localhost:8080/api/getAllEvents", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => data.json())
            .then(data => {
                if(data.status !== "success"){
                    console.log("failed to get all events")
                    return
                }
                console.log(data)
                setEvents(data.events)
            })
    }, [])
    return(
        <>
        <div className="allEvents">
            <h2>all events</h2>
            <h2>this is public post section</h2>
            {events.map((event, index) => (
                <div key={index}>
                    <p> {event.title}</p>
                    <p> {event.description}</p>
                    <p> {event.location}</p>
                    <p> {event.time}</p>
                    <p> {event.date}</p>
                </div>
            ))}
        </div>
        
        </>
    )
}


function MakeEvent(){
    const[title, setTitle] = useState("")
    const[description, setDescription] = useState("")
    const[location, setLocation] = useState("")
    const[time, setTime] = useState("")
    const[date, setDate] = useState("")
    const[open, setOpen] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch("http://localhost:8080/api/makeEvent", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(title, description, location, time, date, open)
        })
        const data = await res.json()

        if(data.status !== "success"){
            console.log("failed to make event")
            return
        }
        console.log("event made")
    }
    return(
        <>
        <div className="makeEvent">
            <h2>make event</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="title" onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="description" onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="location" onChange={(e) => setLocation(e.target.value)} />
                <input type="text" placeholder="time" onChange={(e) => setTime(e.target.value)} />
                <input type="text" placeholder="date" onChange={(e) => setDate(e.target.value)} />
                <input type="text" placeholder="open" onChange={(e) => setOpen(e.target.value)} />
                <button type="submit">submit</button>
            </form>
        </div>
        </>

    )
}

function GetGroup(slug) {
    const [group, setGroup] = useState([{}])
    useEffect(() => {
        fetch("http://localhost:8080/api/getGroup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(slug.params.slug)
        })
            .then(data => data.json()) 
            .then(data => {
                if(data.status !== "success"){
                    console.log("failed to get group")
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
        <div className="groupPage">
            <h1>group page</h1>
            {GetGroup(slug)}
            <MakeEvent />
            <GetEvents />
        </div>
        </>
    )


}

export default GroupPage