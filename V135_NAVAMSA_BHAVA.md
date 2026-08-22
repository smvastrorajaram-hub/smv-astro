# V135 — Navamsa, Bhava & Bhava Sphuta

- Adds D9 Navamsa sign mapping for Lagna and all calculated grahas.
- Adds South Indian-style Navamsa chart.
- Adds Bhava chart with house numbers derived from the sidereal Lagna.
- Adds Bhava Sphuta table using Equal House (30° per house) cusps.
- Adds D9 and Bhava tables for clear row/column display.
- Reworks Ascendant calculation to use the standard eastern-horizon atan2 form, with tropical longitude converted through the same Lahiri-style ayanamsa used for grahas.
- Latitude and east/west longitude affect local sidereal time and the horizon calculation; they are not ignored.

## Accuracy note
This build uses Astronomy Engine planetary positions plus a Lahiri-style sidereal conversion. It is not a Swiss Ephemeris/Placidus certified result. Bhava Sphuta here is explicitly **Equal House**. For professional Swiss Ephemeris matching, use Swiss Ephemeris with the licensed ephemeris files and a documented house system.
