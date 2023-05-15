import { NextRequest } from "next/server"



export async function GET(req)  {
    console.log("GET REQUEST")

    return new Response(JSON.stringify({ message: "Hello World"}), {
        status: 401,
    })
}

export async function POST(req) {

    console.log("POST REQUESTttttttt", req.body)
    
    console.log("POST REQUEST", req)

    return new Response('OK')
}