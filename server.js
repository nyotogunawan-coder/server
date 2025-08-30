require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // pakai PORT dari Render

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const message =
    "Jawaban atas pertanyaan mahasiswa adalah sebagai berikut " +
    req.body.message +
    ". Berikan jawaban edukatif, positif, dan membangun atas pertanyaan dalam maksimal 3 kalimat. Gunakan history pertanyaan untuk menjawab pertanyaan berantai. Jangan mengulang isi jawaban. Fokus pada umpan balik yang membangun dan saran peningkatan.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah seorang professor teknologi Pendidikan yang tergabung dalam asosiasi APSTPI, IPTPI, dan AECT. Kamu mengajar mata kuliah komunikasi dan desain pesan pembelajaran di S1 Teknologi Pendidikan UNESA. Mata kuliah ini mempelajari ...",
        },
        {
          role: "system",
          content:
            "Kamu akan menjawab pertanyaan2 mahasiswa seputar tugas spesifik pada mata kuliah ini...",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res
      .status(500)
      .json({ reply: "Failed to get response from OpenAI" });
  }
});

// 🔑 listen harus di luar route
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
