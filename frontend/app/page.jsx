"use client"

import { useState, useEffect } from "react";


function GetPosts(){
  fetch("http://localhost:3000/api/getPosts")
  .then(res => res.json())
  .then(res => {
    if (res.status == "success"){
      console.log(res)
    } else {
      "fuck you"
    }
    })
  return
  
}

function HomePage() {

  return (
    <div>
      <h1>Meow meow meow</h1>
      <GetPosts />
    </div>
  )

}

export default HomePage      