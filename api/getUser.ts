import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { username } = req.query;

  if (typeof username !== "string" || !username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const cleanUser = username.replace("@", "").trim();

  const SYNDICATION_URL = `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${cleanUser}`;

  try {
    const { data } = await axios.get(SYNDICATION_URL);

    if (!data || data.length === 0) {
      throw new Error("User not found in syndication API");
    }

    const userData = data[0];

    const avatarUrl = userData.profile_image_url_https.replace(
      "_normal",
      "_400x400"
    );

    return res.status(200).json({
      id: userData.id_str || cleanUser,
      username: `@${userData.screen_name}`,
      displayName: userData.name,
      avatarUrl: avatarUrl,
    });
  } catch (error) {
    console.error(`Syndication API failed for ${cleanUser}. Using fallback.`);
  }
}
