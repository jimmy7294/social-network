"use client"
import React, { useEffect, useState } from "react"


function YourGroups(){
  const [groups, setGroups] = useState([]);
  useEffect(() => {
fetch("http://localhost:8080/api/getGroupnames", {
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
    setGroups(data.groups)
  })
  }, [])
  return (
    <>
    <div className="yourGroups">
    <h2>Your Groups</h2>
    <div className="groups">
    {groups.map((group, index) => (
      <div className="group" key={index}>
      <h3>{group}</h3>
      <div/>
      </div>
    ))}
      </div>
      </div>
      </>
   
  )

    
}


function Groups(){
  return (
    <>
    <YourGroups/>
    </>
  )
}

export default Groups;