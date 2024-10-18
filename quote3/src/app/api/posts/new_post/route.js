// this api is to add a post to db.

import { DecodeToken } from "@/lib/back_end/decode_token";
import supabase from "@/lib/db/client";

export async function POST(req) {
  const userId = await DecodeToken(req);

  if (userId === null) {
    return new Response("No token got or Invalid token", {
      status: 401,
    });
  }
  const { content, author } = await req.json();
  const trimmedContent = content.trim();
  const trimmedAuthor = author.trim();

  const res = await supabase
    .from("posts")
    .insert([{ user_id: userId, content: trimmedContent, author: trimmedAuthor }]);

  if (res.error) {
    return new Response("Failed to add new post", {
      status: 500,
    });
  }

  return new Response(`Add new post to user: ${userId}`, {
    status: 200,
  });
}
