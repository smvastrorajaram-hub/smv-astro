# V137 — Navamsa/Bhava/Lagna validation fix

- Keeps the Navamsa positions table and makes the D9 chart populate from the server's explicit `navamsa.planets` payload, including D9 Lagna.
- Reworks the Bhava chart to be house-based (1–12) and preserves the Bhava Sphuta table.
- Uses Astronomy Engine `SiderealTime()` when available for local sidereal time, with longitude and latitude explicitly included in Lagna calculation metadata.
- Returns the UTC birth instant and LST in the API response for validation.
- Keeps the existing equal-house Bhava Sphuta model; this is not a claim of Swiss Ephemeris/Placidus equivalence.
