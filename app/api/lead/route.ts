import { NextResponse } from "next/server";

type Payload = {
  name: string;
  phone: string;
  city: string;
  comment?: string;
  page?: string;
};

const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const city = (body.city || "").trim();
    const comment = (body.comment || "").trim();
    const page = (body.page || "").trim();

    if (!name || !phone || !city) {
      return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
    }

    const text =
      `🧾 <b>Новая заявка</b>\n\n` +
      `👤 <b>Имя:</b> ${esc(name)}\n` +
      `📞 <b>Телефон:</b> ${esc(phone)}\n` +
      `📍 <b>Город/ЖК:</b> ${esc(city)}\n` +
      (comment ? `💬 <b>Комментарий:</b> ${esc(comment)}\n` : "") +
      (page ? `🔗 <b>Страница:</b> ${esc(page)}\n` : "");

    // ===== TELEGRAM =====
    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (botToken && chatId) {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      if (!tgRes.ok) {
        // не падаем, но сообщим
        console.error("Telegram send failed", await tgRes.text());
      }
    }

    // ===== EMAIL (опционально) =====
    // Тут безопасно: без привязки к конкретному провайдеру.
    // Самый быстрый вариант: Resend / Postmark / Sendgrid.
    // Я сделал универсальную заглушку: если задан WEBHOOK_EMAIL_URL — отправляем туда.
    const webhook = process.env.WEBHOOK_EMAIL_URL;
    if (webhook) {
      const mailRes = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Новая заявка с сайта",
          text: `Имя: ${name}\nТелефон: ${phone}\nГород/ЖК: ${city}\nКомментарий: ${comment}\nСтраница: ${page}`,
        }),
      });

      if (!mailRes.ok) {
        console.error("Email webhook failed", await mailRes.text());
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
