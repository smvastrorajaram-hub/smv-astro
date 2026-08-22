# V131 - Horoscope Invalid Time / Moon Longitude Fix

Root cause found in V130: `Astronomy.EclipticGeoMoon(date)` returns a `Spherical` object whose longitude property is `lon`, not `elon`. Using `.elon` produced `undefined`, which propagated to NaN Moon longitude, then an undefined Nakshatra/Dasha lord, then an Invalid Date during Dasha period generation. JavaScript throws `RangeError: Invalid time value` when `toISOString()` is called on an invalid Date.

Fixed:
- Moon longitude uses `.lon`.
- Finite-value checks added for tropical and sidereal longitudes.
- Dasha input validation added.
- Existing India time parsing remains unchanged: 22:05 is accepted as 10:05 PM.
