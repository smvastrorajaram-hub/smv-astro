# V130 — Final birth-time handling fix

This version validates HTML time input (`HH:mm`) and optional 12-hour strings, converts India local birth time (Asia/Kolkata, UTC+05:30) to an explicit UTC `Date`, then passes that native `Date` directly to Astronomy Engine. The engine accepts JavaScript Date values directly.

It also logs the received horoscope date/time/coordinates and returns the received values on calculation errors to make Render debugging straightforward.
