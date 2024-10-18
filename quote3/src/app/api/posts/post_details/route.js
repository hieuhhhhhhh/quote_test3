import supabase from "@/lib/db/client";

export async function POST(req) {
  const { post_id, user_id } = await req.json();

  // Fetch tb 'posts'
  const { data: data1 } = await supabase
    .from("posts")
    .select("user_id,content,author,likes")
    .eq("id", post_id)
    .single();

  // Fetch tb 'users_info':
  const owner_id = data1.user_id;

  const [{ data: data2 }, { data: data3 }, { data: data4 }] = await Promise.all(
    [
      supabase
        .from("users_info")
        .select("alias,avatar")
        .eq("user_id", owner_id)
        .single(),

      supabase.from("users").select("username").eq("id", owner_id).single(),

      supabase
        .from("likes")
        .select("*")
        .eq("post_id", post_id)
        .eq("user_id", user_id)
        .limit(1),
    ]
  );
  return new Response(
    JSON.stringify({
      likes: data1?.likes || 0,
      content: data1?.content || "",
      author: data1?.author || "",
      alias: data2?.alias || "",
      avatar: data2?.avatar || "",
      username: data3?.username || "",
      is_liked: data4?.length > 0 || false,
    }),
    { status: 200 }
  );
}
