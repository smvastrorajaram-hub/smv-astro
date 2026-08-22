# V141 — AI எதிர்கால பலன்

- Renamed the existing horoscope interpretation placeholder to `✨ AI எதிர்கால பலன்`.
- Added a real server-side `/api/horoscope/ai-future` endpoint.
- Uses Gemini 3.7 Flash when `GEMINI_API_KEY` is configured in Render Environment Variables.
- The AI receives only verified Swiss Ephemeris-derived chart data; it is instructed not to recalculate astronomy or alter Bhava Sphuta values.
- Added a lightweight per-IP rate limit (default 10 requests / 10 minutes).
- API keys are never placed in frontend JavaScript.
- If no key is configured, the UI shows a clear configuration message instead of pretending AI generation works.
- No new images or chart artwork were added.
