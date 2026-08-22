# V129 — Invalid Time Value Fix

This build hardens the horoscope calculation time pipeline:
- Accepts native mobile `input[type=time]` values such as `22:05`.
- Accepts `10:05 PM` and `10.05 PM` when text input is used.
- Validates calendar date and time ranges before astronomy calculations.
- Converts the validated UTC JavaScript Date explicitly with `Astronomy.MakeTime()` before calling Astronomy Engine planetary functions.
- Keeps `Asia/Kolkata` / UTC+05:30 handling for the current SMV ASTRO form.
- Returns a clear Tamil validation message instead of the generic `Invalid time value`.

After replacing the GitHub files, redeploy the Render service. No Firebase or Razorpay secrets need to be changed.
