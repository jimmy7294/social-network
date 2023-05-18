import { NextResponse } from "next/server";
import user from "./user.json";

export async function GET(request) {
  return NextResponse.json(user);
}

// a POST function take request as param and return body
