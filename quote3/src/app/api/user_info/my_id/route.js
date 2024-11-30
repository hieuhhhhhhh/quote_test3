// read token => return user's id

import { DecodeToken } from "@/lib/back_end/decode_token";
import { setTokenCookie } from "../../authentication/login/helpers/set_token_cookie";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = await DecodeToken(req.headers.get("cookie"));

  if (userId === null) {
    return NextResponse.json(
      { message: "No token got or Invalid token" },
      { status: 401 }
    );
  }
  let response = NextResponse.json({
    myId: userId,
  });
  setTokenCookie(response, userId);

  return response;
}
