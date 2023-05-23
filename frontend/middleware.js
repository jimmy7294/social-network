import { NextRequest, NextResponse } from "next/server";


export async function middleware(req, NextRequest){
    const cookie = req.cookies.get('SessionToken')
    
if(cookie === undefined){
    console.log(cookie ,"bla")
    return NextResponse.redirect("http://localhost:3000/login")
}
console.log(cookie ,"bla")
    
        // const result = await fetch("http://localhost:8080/api/cookie")
        // if(!result.ok){
        //     console.log("problem cookie fetch")
        //     return NextResponse.redirect("http://localhost:3000/login")
        //}
    return NextResponse.next()
}


export const config = {
    matcher: ['/', '/post', '/profile']
}