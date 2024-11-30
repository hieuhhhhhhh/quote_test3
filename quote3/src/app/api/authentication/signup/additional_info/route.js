import { DecodeToken } from "@/lib/back_end/decode_token";
import supabase from "@/lib/db/client";

export async function POST(req) {
  try {
    const { alias, bio } = await req.json(); // Parsing the body correctly
    const userid = await DecodeToken(req.headers.get("cookie"));

    if (userid === null) {
      throw new Response("No token got or Invalid token", {
        status: 401,
      });
    }

    // Use upsert to handle both add and update
    const res = await supabase.from("users_info").upsert(
      { user_id: userid, alias: alias, biography: bio }, // Data to insert or update
      { onConflict: "user_id" } // Conflict resolution based on user_id
    );

    if (res.error) {
      throw new Error(JSON.stringify(res.error));
    }

    return new Response("Success: additional profile information saved", {
      headers: { "Content-Type": "application/json" },
      status: 200, // Return a success status code
    });
  } catch (e) {
    return new Response(e.message, {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
