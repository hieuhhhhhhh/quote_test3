import { DecodeToken } from "@/lib/back_end/decode_token";
import supabase from "@/lib/db/client";

export async function GET(req) {
  const userId = await DecodeToken(req.headers.get("cookie"));

  if (userId === null) {
    return new Response("No token got or Invalid token", {
      status: 401,
    });
  }

  const { data, error } = await supabase.rpc("fetch_reports_by_admin", {
    admin_user_id: userId,
  });

  if (error) {
    return new Response(error.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
