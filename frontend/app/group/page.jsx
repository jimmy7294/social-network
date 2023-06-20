"use client"
import React, { useEffect, useState } from "react"
import Headers from "../components/Header";


function MakeGroup(){
  const [groupname, setGroupname] = useState("");
  const [groupdescription, setGroupdescription] = useState("");


const handleNewGroup = () => {
  e.preventDefault();
  fetch("http://localhost:8080/api/makeGroup", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({groupname, groupdescription}),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log("failed to make group");
        return;
      }
      console.log("group made");
    });
};
  return (
    <>
    <form onSubmit={(e) => handleNewGroup(e)}>
    <input type="text" placeholder="Group Name" onChange={(e) => setGroupname(e.target.value)}></input>
    <input type="text" placeholder="Group Description" onChange={(e) => setGroupdescription(e.target.value)}></input>
    <button type="submit">Make Group</button>
    </form>
    </>
  )
}

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
      <a href={`group/${group}`}>{group}</a>
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
    <Headers/>
    <MakeGroup/>
    <YourGroups/>
    </>
  )
}

export default Groups;