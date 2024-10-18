import supabase from "@/lib/db/client";
import Shuffle from "@/lib/back_end/shuffle";
export async function POST(req) {
  try {
    // Parse the array of IDs from the incoming request
    const { ids } = await req.json();

    // Validate the IDs array
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty array of IDs" }),
        { status: 400 }
      );
    }

    // Query the "posts" table using Supabase to select rows where the ID is in the given array
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, author")
      .in("id", ids);

    // Handle any errors from the query
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    Shuffle(data);

    // Return the retrieved data
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    // Handle any unexpected errors
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
