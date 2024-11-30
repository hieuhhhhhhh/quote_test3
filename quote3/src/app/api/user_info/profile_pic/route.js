import { DecodeToken } from "@/lib/back_end/decode_token";
import SaveProfilePicURL from "./helpers/save_pfp_URL";
import GenerateWebp from "./helpers/generate_webp";
import UploadImg from "./helpers/upload_img";
import GetProfilePicURL from "./helpers/get_pfp_URL";
import GenerateUploadAvatar from "./helpers/avatar";

export async function POST(req) {
  try {
    const userId = await DecodeToken(req.headers.get("cookie"));

    if (userId === null) {
      throw new Response("No token or invalid token", {
        status: 401,
      });
    }

    const webp = await GenerateWebp(req);

    // Upload webp to supabase storage:
    const fileName = await UploadImg(userId, webp);

    // Generate avatar:
    const avatarUrl = await GenerateUploadAvatar(userId, webp);

    // Generate URL for the uploaded image
    const url = await GetProfilePicURL(fileName);

    // Store URL to db (not await this one):
    SaveProfilePicURL(userId, url);

    // Respond the url of avatar:
    return new Response(JSON.stringify({ avatar: avatarUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // catch error responses
  } catch (e) {
    return e;
  }
}
