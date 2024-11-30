// this api is to decode token => return user's id

import jwt from "jsonwebtoken";
import { parse } from "cookie";

export async function DecodeToken(cookieHeader) {
  // Parse cookies from the request
  try {
    //const cookieHeader = req.headers.get("cookie");
    const cookies = parse(cookieHeader || "");
    const token = cookies.session_token;

    if (!token) {
      console.log("Error (decode_token.js): No token got");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Current user ID: ", decoded.user_id);
    return decoded.user_id;

    //
  } catch (e) {
    console.log("Error (decode_token.js): ", e);
    return null;
  }
}
