# SMV ASTRO V126 — Free Commercial Closed-Source Astrology Engine

## Engine
This build removes the Swiss Ephemeris dependency and uses **Astronomy Engine** for astronomical positions. Astronomy Engine is MIT licensed and supports commercial use, subject to retaining its copyright/license notice.

Official project: https://github.com/cosinekitty/astronomy

## Important accuracy note
This build is **not Swiss Ephemeris** and does not claim Swiss Ephemeris equivalence. It uses Astronomy Engine's planetary calculations plus a Lahiri-style sidereal conversion implemented by SMV ASTRO. The ascendant is calculated from sidereal time and an obliquity model. Treat this as a practical astronomy-based Vedic calculation layer, not a certified ephemeris-standard replacement.

## Commercial use
The Astronomy Engine dependency is MIT licensed. Keep the included third-party attribution/license notice. Your application source can remain proprietary, subject to the licenses of all other dependencies and services you use.

## Environment
No `SWISSEPH_EPHE_PATH` or `.se1` files are required in V126.

## API
- `POST /api/horoscope/calculate`
- `POST /api/horoscope/calculate-legacy`
- `POST /api/horoscope/validate`

## Firebase
V122 Firestore rules and indexes are retained.
