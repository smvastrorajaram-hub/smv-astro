SMV ASTRO V142 FINAL RELEASE
============================

1. English Horoscope Mode
- English mode must render horoscope headings, tables, chart labels and AI interpretation in English.
- Tamil mode retains approved Tamil labels.
- D-1 Rasi, Bhava Chart/Bhava Sphuta and AI Future Insights follow selected language.

2. Birth Place Auto Location
- Begin suggestions after 2+ characters.
- Show full place name (City, State, Country).
- Selecting a suggestion stores latitude and longitude.
- Horoscope calculations must use selected coordinates.
- Do not expose geocoder API keys in frontend JavaScript.
- Ambiguous places require explicit selection.

3. Horoscope Validation
- Validate Lagna.
- Validate 12 Bhava Sphuta values.
- Validate Arambha / Madhya / Antya.
- Validate planet-to-Bhava mapping.
- Validate South Indian D-1 and Bhava Chalit rendering.
- Use one fixed birth-data regression case for comparison.

4. AI Future Insights
- AI interprets verified Swiss Ephemeris output.
- AI must not independently calculate planetary positions.
- Fixed Gemini model: gemini-3.7-flash.
- GEMINI_API_KEY remains server-side in Render.

5. UI
- No new images.
- Preserve current design.
- Bhava table remains aligned/responsive.
