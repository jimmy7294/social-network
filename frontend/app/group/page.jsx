"use client"
import React, { useEffect, useState } from "react"
import Headers from "../components/Header";
import { useRouter } from "next/navigation";




function MakeGroup(){

  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

const handleNewGroup = (e) => {
  e.preventDefault();
 
  fetch("http://localhost:8080/api/addGroup", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name, description}),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status !== "success") {
        console.log("failed to make group");
        return;
      }
      console.log("group made");
      const url = `/group/${name}`;
      router.push(url)
    });
};
  return (
    <>
    <form className="groupmaker" onSubmit={(e) => handleNewGroup(e)}>
    <input className="titleCreation" type="text" placeholder="Group Name" onChange={(e) => setGroupname(e.target.value)}></input>
    <br />
    <textarea className="aboutMe" type="text" placeholder="Group Description" onChange={(e) => setGroupdescription(e.target.value)}></textarea>
    <br />
    <button type="submit" className="postCreationButton">Make Group</button>
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
    {groups.map((group, index) => (
      <div className="group" key={index}>
      <a className="link-up" href={`group/${group}`}>{group}</a>
      </div>
    ))}
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