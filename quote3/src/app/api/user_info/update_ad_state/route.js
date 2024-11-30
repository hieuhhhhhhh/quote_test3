import { DecodeToken } from "@/lib/back_end/decode_token";
import { NextResponse } from "next/server";
import supabase from "@/lib/db/client";

export async function POST(req) {
  try {
    // Decode the token to get the userId
    const userId = await DecodeToken(req.headers.get("cookie"));

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Invalid token or token not provided." }),
        { status: 401 }
      );
    }

    // Parse the request body to get the new 'ads' value
    const body = await req.json();
    const { ads } = body;

    // Update the 'ads' value in the 'users_info' table for the given userId
    const { error: updateError } = await supabase
      .from("users_info")
      .update({ ads })
      .eq("user_id", userId);

    if (updateError) {
      return new Response(
        JSON.stringify({
          message: `Error updating ads: ${updateError.message}`,
        }),
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Ads preference updated successfully.",
      userId,
      ads,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "An unexpected error occurred.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
