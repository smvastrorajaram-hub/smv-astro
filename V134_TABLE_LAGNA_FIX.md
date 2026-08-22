# SMV ASTRO V134 – Table, Chart and Lagna Accuracy Fix

## Changes
- Fixed sidereal ascendant branch in `ascendantLongitude()` by selecting the correct ecliptic intersection (+180° normalization).
- Planet table now has explicit columns: கிரகம், ராசி, பாகை, நட்சத்திரம், பாதம்.
- Vimshottari Dasha table now uses a dedicated responsive table style with one period per row and four fixed columns.
- Added professional borders, alternating rows, wrapping and horizontal scroll on small screens.
- South Indian chart planet entries now show planet name and degree on separate clean lines instead of white/unstyled blocks.
- Lagna summary now also shows computed longitude.
- Existing Firebase, Razorpay, Render and horoscope calculation configuration is preserved.

## Important validation note
The ascendant is calculated from birth date, exact local time, latitude and longitude. It must not be hard-coded to a single sign. The bundled engine uses a Lahiri-style sidereal conversion; for professional Swiss Ephemeris validation, compare against the exact same ephemeris, ayanamsha, timezone and house settings.
