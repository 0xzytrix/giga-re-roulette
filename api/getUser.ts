import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;

  if (typeof username !== "string" || !username) {
    return res.status(400).json({ error: "Username parameter is required" });
  }

  // Очищаем от @ если передали
  const cleanUsername = username.replace("@", "");
  const X_URL = `https://x.com/${cleanUsername}`;

  try {
    const { data: html } = await axios.get(X_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(html);

    // Попытка найти мета-теги (они чаще доступны в статике, чем React-компоненты)
    const displayName =
      $('meta[property="og:title"]').attr("content") ||
      $('[data-testid="UserName"] span').first().text();

    let avatarUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('[data-testid="UserAvatar-Container"] img').attr("src");

    if (!displayName || !avatarUrl) {
      // Фоллбэк, если парсинг не удался, чтобы не крашить демо совсем
      // В реальном бою здесь будет throw Error
      throw new Error("Parsing failed (X.com blocking or layout changed)");
    }

    // Улучшаем качество аватарки
    avatarUrl = avatarUrl.replace("_normal", "_400x400");

    const player = {
      id: cleanUsername.toLowerCase(),
      username: `@${cleanUsername}`,
      displayName: displayName.replace(` (@${cleanUsername})`, "").trim(), // Мета тег иногда содержит ник в скобках
      avatarUrl: avatarUrl,
    };

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    return res.status(200).json(player);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to parse user ${cleanUsername}:`, error.message);
    return res
      .status(500)
      .json({ error: "Failed to parse user profile. X blocked the request." });
  }
}
