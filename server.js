// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Эти переменные ты задашь в Render → Settings → Environment
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрут для приёма формы
app.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const text = `📩 Новая заявка с сайта:\n\n👤 Имя: ${name}\n📧 Email: ${email}\n💬 Сообщение: ${message}`;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
    });

    res.status(200).json({ success: true, message: "Заявка успешно отправлена!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Ошибка при отправке заявки." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

