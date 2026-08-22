SMV ASTRO V143 - AI + Birth Place Hotfix

FIXED:
1. Birth Place autocomplete is now actually wired to /api/geocode.
2. Typing 2+ characters searches Indian locations and shows selectable suggestions.
3. Selecting a place automatically fills latitude and longitude.
4. Horoscope generation requires a selected location when coordinates are not manually supplied.
5. Gemini model is fixed in server code as gemini-3.7-flash; GEMINI_MODEL environment variable is no longer used.
6. Gemini 503/429/5xx responses are retried automatically with exponential backoff.
7. Gemini 3.7 Flash uses low thinking level for faster AI Future generation.
8. No new images or visual redesign.

NOTE: The public Nominatim/OpenStreetMap geocoder is used server-side. The app sends only the typed place query and receives coordinates; no geocoder API key is exposed in the browser.
