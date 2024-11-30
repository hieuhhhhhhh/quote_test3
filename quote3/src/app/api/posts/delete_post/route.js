import { DecodeToken } from "@/lib/back_end/decode_token";
import supabase from "@/lib/db/client";

export async function POST(req) {
  try {
    const { post_id, role } = await req.json();
    const user_id = await DecodeToken(req.headers.get("cookie"));

    // Check if token is valid
    if (!user_id) {
      return new Response(
        JSON.stringify({ message: "Invalid or missing token" }),
        {
          status: 401,
        }
      );
    }

    let error = {};
    let count = 0;

    // Precautions for deleting posts
    if (role === "admin") {
      // Perform the deletion in the 'posts' table
      const res = await supabase
        .from("posts")
        .delete({ returning: "count" }) // Ensures row count is returned
        .eq("id", post_id);

      error = res.error;
      count = res.count;

      if (error) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 500,
        });
      }
    } else {
      // Perform the deletion in the 'posts' table
      const res = await supabase
        .from("posts")
        .delete({ returning: "count" }) // Ensures row count is returned
        .eq("id", post_id)
        .eq("user_id", user_id);

      error = res.error;
      count = res.count;

      if (error) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 500,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Post '${post_id}' deleted successfully.`,
        deletedRows: count,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "An error occurred.", details: error.message }),
      { status: 500 }
    );
  }
}
