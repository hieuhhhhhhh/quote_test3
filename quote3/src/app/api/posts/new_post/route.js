import { DecodeToken } from "@/lib/back_end/decode_token";
import supabase from "@/lib/db/client";
import GenerateWebp from "./helpers/generate_webp";
import UploadImg from "./helpers/upload_img";
import GetImgURL from "./helpers/get_img_URL";
import StoreImgURL from "./helpers/store_img_URL";

export async function POST(req) {
  try {
    const userId = await DecodeToken(req.headers.get("cookie"));

    if (userId === null) {
      throw new Response("No token or invalid token", {
        status: 401,
      });
    }

    const { content, author, base64_bg_img, background_color, text_is_white } =
      await req.json();

    const trimmedContent = content.trim();
    const trimmedAuthor = author.trim();

    // Call the stored function to add the post and post style
    const { data, error } = await supabase.rpc("add_post_with_style", {
      user_id: userId,
      content: trimmedContent,
      author: trimmedAuthor,
      background_color,
      text_is_white,
    });

    if (error) {
      throw new Response(error.message, {
        status: 500,
      });
    }

    const post_id = data;

    // Step 2.0:
    if (base64_bg_img) {
      const webp = await GenerateWebp(base64_bg_img);

      // Upload webp to supabase storage:
      const fileName = await UploadImg(post_id, webp);

      // Generate URL for the uploaded image
      const url = await GetImgURL(fileName);

      // Step 2.1:
      await StoreImgURL(post_id, url);
    }

    return new Response(JSON.stringify({ post_id: post_id }), {
      status: 200,
    });

    //
  } catch (e) {
    if (e instanceof Response) return e;
    else return new Response(e.message, { status: 500 });
  }
}
