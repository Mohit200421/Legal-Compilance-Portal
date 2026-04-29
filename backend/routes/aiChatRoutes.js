const express = require("express");
const router = express.Router();
const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
You are a professional Indian legal assistant for LAWSETU.

STRICT INSTRUCTIONS:
- Only answer in Indian legal context
- FIR ALWAYS means "First Information Report"
- Do NOT give multiple meanings
- Do NOT mention electronics, aviation, or any other domain
- If question is ambiguous, assume it is legal
- Answer in simple language like explaining to a client

Question:
${question}

Final Answer (legal only):
`;

    const response = await axios.post(OLLAMA_URL, {
      model: "llama3",
      prompt: prompt,
      stream: false,
    });

    res.json({ answer: response.data.response });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;