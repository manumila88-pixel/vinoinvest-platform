import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

// POST /api/label-scan — analyze wine label image
// Body: { image_base64: "data:image/jpeg;base64,..." }
router.post("/", async (req, res) => {
  try {
    const { image_base64 } = req.body;
    if (!image_base64) return res.status(400).json({ error: "image_base64 required" });

    if (!client) {
      return res.status(503).json({ error: "Vision API not configured. Set ANTHROPIC_API_KEY." });
    }

    // Strip data URI prefix if present
    const base64Data = image_base64.replace(/^data:image\/[a-z]+;base64,/, "");
    const mediaType = image_base64.startsWith("data:image/png") ? "image/png"
      : image_base64.startsWith("data:image/webp") ? "image/webp"
      : "image/jpeg";

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 512,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Data },
          },
          {
            type: "text",
            text: `You are a master sommelier. Analyze this wine label image and extract:
1. Wine name (exact)
2. Producer/winery name
3. Vintage year (4-digit year)
4. Region/appellation
5. Wine type (red, white, rosé, sparkling, sweet)
6. Country of origin

Respond ONLY with valid JSON in this exact format:
{
  "wine_name": "...",
  "producer": "...",
  "vintage": "2018",
  "region": "...",
  "type": "red",
  "country": "...",
  "confidence": 85
}
If you cannot read a field clearly, use null. confidence is 0-100.`,
          },
        ],
      }],
    });

    const text = response.content[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(422).json({ error: "Could not parse label", raw: text });

    const parsed = JSON.parse(jsonMatch[0]);

    // Build search query for our wine database
    const searchQuery = [parsed.wine_name, parsed.vintage].filter(Boolean).join(" ").trim();

    res.json({ ...parsed, search_query: searchQuery });
  } catch (e) {
    console.error("[labelScan]", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
