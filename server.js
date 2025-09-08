// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Эти переменные нужно задать в Render → Settings → Environment
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// --- Middleware ---
app.use(cors()); // разрешаем CORS для всех
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Проверка сервера
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Маршрут для приёма формы
app.post("/send", async (req, res) => {
  try {
    const { name, email, phone, city, message } = req.body;

    const text = `📩 Новая заявка с сайта:\n\n👤 Имя: ${name || "-"}\n📧 Email: ${email || "-"}\n📱 Телефон: ${phone || "-"}\n🏙️ Город: ${city || "-"}\n💬 Сообщение: ${message || "-"}`;

    const tgResponse = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "HTML",
      }
    );

    if (tgResponse.data && tgResponse.data.ok) {
      res.status(200).json({ success: true, message: "Заявка успешно отправлена!" });
    } else {
      res.status(500).json({
        success: false,
        message: tgResponse.data?.description || "Ошибка при отправке в Telegram",
      });
    }
  } catch (error) {
    console.error("Telegram send error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, message: "Ошибка при отправке заявки." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
