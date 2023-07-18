import { NextRequest, NextResponse } from "next/server";
import cookie from "js-cookie";


//runs when ever a file is loaded on the page and checks if the cookie is still valid


export async function middleware(req, NextRequest){
    const cookiee = req.cookies.get('session_token')
    console.log("should be session",cookiee)
    //console.log("wtf is req", req)
    //if there is no cookie pressent at all, redirct to login page
if(cookiee === undefined && req.nextUrl.href !== "http://localhost:3000/register"){
    return NextResponse.redirect("http://localhost:3000/login")
}
// if cookie is pressent sends to backend for validation
const response = await fetch("http://localhost:8080/api/cookie", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Cookie":`${cookiee.name}=${cookiee.value}`
    }
    });
    const data = await response.json();
    //console.log("cookie check data",data.status === "success")

    //if cookie is different from the DB throw error and stay on login
    if (data.status !== "success" && req.nextUrl.href !== "http://localhost:3000/register") {
      console.log("got to throw error")
      //throw new Error("error in cookie check")
      return NextResponse.redirect("http://localhost:3000/login")
    }
    if (req.nextUrl.href === "http://localhost:3000/login" || req.nextUrl.href === "http://localhost:3000/register") {
        return NextResponse.redirect("http://localhost:3000/")
    }
    console.log("should be url",req.nextUrl.href)
// eveyrthing ok u may continue
    console.log("cookie check success")
    return NextResponse.next()
}


export const config = {
    matcher: ['/', '/post', '/profile/:path*','/optional', '/msg/:path*', '/group/:path*', '/chat/:path*', '/login', '/register']
}