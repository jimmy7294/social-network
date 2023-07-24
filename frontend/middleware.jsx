"use client";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req, NextRequest) {
  const cookiee = req.cookies.get("session_token");
  console.log("should be session", cookiee);
  let response = NextResponse.next();

  if (cookiee === undefined) {
    if (
      req.nextUrl.href === "http://localhost:3000/login" ||
      req.nextUrl.href === "http://localhost:3000/register"
    ) {
      return response;
    } else return NextResponse.redirect("http://localhost:3000/login");
  }

  return fetch("http://backend:8080/api/cookie", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${cookiee.name}=${cookiee.value}`,
    },
  })
    .then((fetchResponse) => fetchResponse.json())
    .then((data) => {
      if (data.status !== "success") {
        const responso = NextResponse.redirect("http://localhost:3000/login");
        responso.cookies.delete("session_token");
        return responso;
      }
      if (
        data.status === "success" &&
        (req.nextUrl.href === "http://localhost:3000/login" ||
          req.nextUrl.href === "http://localhost:3000/register")
      ) {
        return NextResponse.redirect("http://localhost:3000/");
      }
      console.log("cookie check success");
      return response;
    })
    .catch((error) => {
      // Handle any errors from the fetch here
      console.log(error);
      return NextResponse.next();
    });
}

export const config = {
  matcher: [
    "/",
    "/post",
    "/profile/:path*",
    "/optional",
    "/msg/:path*",
    "/group/:path*",
    "/chat/:path*",
    "/login",
    "/register",
  ],
};
