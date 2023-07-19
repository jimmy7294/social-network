import { NextRequest, NextResponse } from "next/server";
//import Cookies from "js-cookie";
//import {cookies} from "next/headers";


//runs when ever a file is loaded on the page and checks if the cookie is still valid


export async function middleware(req, NextRequest){
    //console.log("what is a req",req)
    const cookiee = req.cookies.get('session_token')
    console.log("should be session",cookiee)
    let response = NextResponse.next()

    //if there is no cookie pressent at all, redirct to login page
if(cookiee === undefined){
    if (req.nextUrl.href === "http://localhost:3000/login" || req.nextUrl.href === "http://localhost:3000/register") {
        return response
    } else return NextResponse.redirect("http://localhost:3000/login")
    
}
// if cookie is pressent sends to backend for validation
const fetchResponse = await fetch("http://localhost:8080/api/cookie", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Cookie":`${cookiee.name}=${cookiee.value}`
    }
    });
    const data = await fetchResponse.json();

    //if cookie is different from the DB throw error and stay on login
    if (data.status !== "success") {
        const responso = NextResponse.redirect("http://localhost:3000/login")
        responso.cookies.delete("session_token")
        return responso
    }
    if (data.status === "success" && (req.nextUrl.href === "http://localhost:3000/login" || req.nextUrl.href === "http://localhost:3000/register")) {
        return NextResponse.redirect("http://localhost:3000/")
    }
// eveyrthing ok u may continue
    console.log("cookie check success")
    //return NextResponse.next()
    return response
}


export const config = {
    matcher: ['/', '/post', '/profile/:path*','/optional', '/msg/:path*', '/group/:path*', '/chat/:path*', '/login', '/register']
}