import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS настройки
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date"
  );

  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username required" });
  }

  const cleanUser = username.replace("@", "").trim();

  // URL профиля
  const twitterUrl = `https://x.com/${cleanUser}`;

  // Используем Microlink API как прокси-парсинг
  // Это бесплатно для небольших объемов и работает намного стабильнее на Vercel
  const API_URL = `https://api.microlink.io/?url=${encodeURIComponent(
    twitterUrl
  )}`;

  try {
    const { data: response } = await axios.get(API_URL, { timeout: 4000 });

    if (response.status === "fail" || !response.data) {
      throw new Error("Microlink failed to parse");
    }

    const { data } = response;

    // Microlink достает данные из мета-тегов
    // data.title обычно содержит "Name (@username) on X"
    // data.image?.url содержит аватарку

    let displayName = cleanUser;
    // Пытаемся вытащить чистое имя из заголовка "Elon Musk (@elonmusk) / X"
    if (data.title && data.title.includes("(")) {
      displayName = data.title.split("(")[0].trim();
    }

    // Проверяем, есть ли картинка
    const avatarUrl = data.image?.url ? data.image.url : null;

    if (!avatarUrl) {
      throw new Error("No avatar found");
    }

    return res.status(200).json({
      id: cleanUser.toLowerCase(),
      username: `@${cleanUser}`,
      displayName: displayName,
      avatarUrl: avatarUrl,
    });
  } catch (error) {
    console.error(`Parsing error for ${cleanUser}:`, (error as Error).message);

    // === FALLBACK (ПЛАН Б) ===
    // Если всё сломалось, генерируем красивую заглушку
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${cleanUser}&background=9d4edd&color=fff&size=200&bold=true&length=2`;

    return res.status(200).json({
      id: cleanUser.toLowerCase(),
      username: `@${cleanUser}`,
      displayName: cleanUser,
      avatarUrl: fallbackAvatar,
      isFallback: true,
    });
  }
}
