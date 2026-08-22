# V139 Bhava Sphuta / South Indian Bhava Chalit Fix

- Corrects India local birth time conversion to UTC using `utcOffsetMinutes` (default +330).
- Uses Swiss Ephemeris `S` (Sripati) as the default house system.
- Extracts the 12 Swiss house cusps safely from the 1-based cusp array when available.
- Adds Bhava Arambha, Madhya/Sphuta and Antya values.
- Keeps South Indian Rasi boxes fixed in the Bhava Chalit chart.
- Planets remain in their sidereal Rasi boxes; each planet shows its calculated Bhava number.
- Bhava cusp markers are overlaid in the Rasi box containing the cusp.
- Frontend explicitly sends Asia/Kolkata and UTC+05:30 for the current India-targeted project.

## Important

The `sweph` package must be installed on the deployment environment and the project's licensed Swiss Ephemeris data must be available under `./ephe` or `SWISSEPH_EPHE_PATH`.
