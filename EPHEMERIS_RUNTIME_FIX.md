# V139 Runtime Fix

The Render error `சூரியன்: Swiss Ephemeris calculation failed` occurred because the deployment did not contain the required Swiss Ephemeris `.se1` data files.

This build now detects `sepl_18.se1` and `semo_18.se1` in `SWISSEPH_EPHE_PATH`.

- If both files are present, calculations use Swiss Ephemeris (`SEFLG_SWIEPH`).
- If they are absent, calculations automatically use Swiss Ephemeris' built-in Moshier ephemeris (`SEFLG_MOSEPH`) instead of failing. This keeps the horoscope endpoint operational while clearly returning `ephemerisMode: MOSEPH`.
- The production deployment should provide the licensed Swiss Ephemeris data files if full SWIEPH mode is required.
- The returned JSON exposes `ephemerisMode` so the frontend/admin diagnostics can distinguish SWIEPH from MOSEPH.

The 1992-2026 test dates are within the coverage of `sepl_18.se1` and `semo_18.se1` when those files are supplied.
