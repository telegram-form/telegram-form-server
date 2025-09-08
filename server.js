const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 🔑 Замени на свои данные из Tilda
const TELEGRAM_TOKEN = "57845d4058443373526fda604af3c8c0"; 
const TELEGRAM_CHAT_ID = "-4957620675"; 

app.post("/send", async (req, res) => {
  const { name, email, phone, city, message } = req.body;

  const text = `
📩 Новая заявка с формы:
👤 Имя: ${name}
✉️ Почта: ${email}
📱 Телефон: ${phone}
🌆 Город: ${city}
💬 Сообщение: ${message}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
    });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
