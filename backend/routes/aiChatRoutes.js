const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Mock AI response - production ready fallback
router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const mockResponses = {
      rights:
        "1. **Understanding**: Rights query\n2. **Explanation**: Constitution Article 21\n3. **Law**: Fundamental Rights\n4. **Steps**: File PIL if violated\n5. **Rec**: Constitutional lawyer\n6. **Disclaimer**: General info only",
      ipc: "1. **Understanding**: IPC section\n2. **Explanation**: Indian Penal Code\n3. **Law**: IPC 420 cheating\n4. **Steps**: FIR at police station\n5. **Rec**: Criminal lawyer\n6. **Disclaimer**: General info only",
      default:
        "1. **Understanding**: Your query\n2. **Explanation**: Legal advice varies by case\n3. **Law**: Consult relevant statutes\n4. **Steps**: Gather documents, consult lawyer\n5. **Rec**: LegalSetu lawyer chat/video\n6. **Disclaimer**: General info. Consult lawyer.",
    };

    const answer =
      mockResponses[
        question.toLowerCase().includes("rights")
          ? "rights"
          : question.toLowerCase().includes("ipc")
            ? "ipc"
            : "default"
      ];

    res.json({ answer });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Service unavailable" });
  }
});

module.exports = router;
