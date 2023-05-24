import { NextRequest, NextResponse } from "next/server";


export async function middleware(req, NextRequest){
    const cookie = req.cookies.get('SessionToken')
    
if(cookie === undefined){
    return NextResponse.redirect("http://localhost:3000/login")
}
const response = await fetch("http://localhost:8080/api/cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Credentials": "include",
      },
      body: JSON.stringify({ email, password}),
    });
    const data = await response.json();

    
    if (!data.ok) {
      throw new Error("error in cookie check")
    } 

    return NextResponse.next()
}


export const config = {
    matcher: ['/', '/post', '/profile']
}