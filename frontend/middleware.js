import { NextRequest, NextResponse } from "next/server";


//runs when ever a file is loaded on the page and checks if the cookie is still valid


export async function middleware(req, NextRequest){
    const cookie = req.cookies.get('session_token')
    //if there is no cookie pressent at all, redirct to login page
if(cookie === undefined){
    return NextResponse.redirect("http://localhost:3000/login")
}
// if cookie is pressent sends to backend for validation
const response = await fetch("http://localhost:8080/api/cookie", {
      method: "POST",
      headers: {
        credentials: "include",
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();

    //if cookie is different from the DB throw error and stay on login
    if (!data.status === "success") {
      throw new Error("error in cookie check")
    } 
// eveyrthing ok u may continue
    console.log("cookie check success")
    return NextResponse.next()
}


export const config = {
    matcher: ['/', '/post', '/profile']
}