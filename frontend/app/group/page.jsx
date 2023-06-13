import React, { useState } from "react"


function yourGroups(){
  const [groups, setGroups] = useState([]);
fetch("http://localhost:8080/api/yourGroups", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((data) => data.json())
  .then((data) => {
    if(data.status !== "success"){
      console.log("error")
      return
    }
    console.log(data)
    setGroups(data.groups)
  })
  return (
    <>
    <div className="groups">
    <h1>Your Groups</h1>
    {groups.map((group) => (
      <div className="group">
      <h2>{group.name}</h2>
      <p>{group.description}</p>
      <p>{group.members}</p>
      <p>{group.events}</p>
      </div>
    ))}
    </div>
    </>
  )

    
}