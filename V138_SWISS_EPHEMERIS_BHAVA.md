# V138 — Swiss Ephemeris Bhava Sphuta / Lagna upgrade

- Primary calculation engine: `sweph` Node.js binding for Swiss Ephemeris 2.10.03.
- Sidereal mode: Lahiri.
- House cusps: `houses_ex2()` with `SEFLG_SIDEREAL`.
- Default house system: Placidus (`P`). Override with `HOUSE_SYSTEM` if your chosen Vedic convention requires another Swiss Ephemeris house system.
- Latitude and longitude are passed directly to Swiss Ephemeris house calculation.
- `ephe/` is intentionally empty except for this README. Add authentic Swiss Ephemeris data files or set `SWISSEPH_EPHE_PATH`.
- V138 does not claim that the old Equal-House Bhava Sphuta is accurate; it replaces that fallback with actual Swiss Ephemeris house cusps.

Swiss Ephemeris documentation states that `swe_houses_ex()` / `swe_houses_ex2()` calculate tropical or sidereal house cusps using Universal Time, geographic latitude/longitude, and a selected house-system code. See the official documentation before selecting a house system.
