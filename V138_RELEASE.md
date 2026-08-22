# SMV ASTRO V138

## Main change
Replaces the old Equal-House fallback for Bhava Sphuta/Lagna with Swiss Ephemeris `houses_ex2()` and Lahiri sidereal mode.

## Included
- Real Swiss Ephemeris planetary longitudes.
- Lahiri sidereal mode.
- Latitude/longitude-aware Ascendant.
- Actual 12 house cusps and Bhava Sphuta values.
- Placidus default house system, configurable with `HOUSE_SYSTEM`.
- D9/Navamsa retained.
- Interactive Vimshottari retained.
- South Indian chart rendering retained.
- Firebase/Razorpay configuration retained.

## Important deployment step
Put authentic Swiss Ephemeris `.se1` files into `ephe/`, or configure `SWISSEPH_EPHE_PATH` to your existing ephemeris directory. Do not use fabricated files.
