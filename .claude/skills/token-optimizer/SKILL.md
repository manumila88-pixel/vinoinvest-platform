# Token Optimizer Skill — VinoInvest

## Model Selection Rules

| Task | Model | Max tokens | Cost/call |
|------|-------|-----------|-----------|
| Blog articles | claude-haiku-4-5-20251001 | 700 | ~$0.0006 |
| Wine scoring | claude-haiku-4-5-20251001 | 512 | ~$0.0004 |
| Batch analysis (10 wines) | claude-haiku-4-5-20251001 | 1024 | ~$0.0008 |
| Agent chat (simple Q&A) | claude-haiku-4-5-20251001 | 1000 | ~$0.0010 |
| Portfolio deep analysis | claude-sonnet-4-6 | 3000 | ~$0.0090 |

**Rule:** Use Haiku by default. Only switch to Sonnet when the task requires:
- Multi-step reasoning across 5+ data points
- Investment advice with risk/return tradeoffs
- Comparing multiple strategies with context

## Prompt Compression Rules

1. **Remove articles**: "the wine" → "wine"
2. **Use pipes**: `Name|Price|Region` instead of JSON keys
3. **Use abbreviations**: `w/ instead of with`, `btl` for bottles
4. **Inline constraints**: `400w` = 400 words, `<15w` = under 15 words
5. **One-line system prompt**: `"Expert wine AI. JSON only. No markdown."`
6. **Avoid repetition**: State format once, don't re-explain in each prompt

## Prompt Templates

### Wine score (single)
```
Wine:{name}|€{price}|{region}|{vintage}|Score:{investmentScore}|Risk:{risk}
JSON:{score:0-100,signal:BUY|HOLD|SELL,reason:"<20w"}
```

### Batch score (up to 10 wines)
```
Score wines 0-100:
0.{name}|€{price}|{risk}|{trend}
1.{name}|€{price}|{risk}|{trend}
...
[{i,score,signal}]
```

### Blog article
```
SEO article Italian wine investment. Topic:"{title}". 350w.
JSON:{title,slug,excerpt,content,category,readTime}
```

### Portfolio analysis
```
Portfolio {n} wines,€{value},ROI:{roi}%
Holdings:{name}({roi}%),...
JSON:{score,risks:[],actions:[],verdict}
```

## Prompt Caching Strategy

Apply `cache_control: { type: "ephemeral" }` to system prompts that:
- Are reused across multiple calls (agent chat sessions)
- Are longer than 100 tokens
- Are called more than 5x per minute

Example (already implemented in aiOptimizer.js):
```js
const CACHED_SYSTEM = [{
  type: "text",
  text: "Expert wine investment AI. Return JSON only. No markdown. Be concise.",
  cache_control: { type: "ephemeral" }
}];
```

Cache saves ~90% of input token cost on repeat calls within 5 minutes.

## Budget Limits

- Normal agent call: max 1000 tokens output
- Portfolio analysis: max 3000 tokens output
- Blog article: max 700 tokens output
- Batch wine scoring: max 1024 tokens output
- Hard limit per day: monitor via GET /api/admin/costs → alert if >$5/day

## Cost Estimation Before Calling

```js
import { estimateTokenCost } from "./services/aiOptimizer.js";
const est = estimateTokenCost(prompt, 500, "claude-haiku-4-5-20251001");
// { inputTokens, outputTokens, estimatedCostUsd }
if (est.estimatedCostUsd > 0.05) console.warn("High cost call");
```
