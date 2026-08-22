# V139 Runtime FIX3

Fixes the Render error:
`பாவ/லக்னம்: Swiss Ephemeris returned invalid data`

Root cause: `houses_ex2()` returns `data` as an object containing `houses` and `points`, while the generic `fail()` validator expected `data` to be an array. FIX3 validates house results separately and normalizes 0-based/1-based cusp arrays safely.

House system remains Sripati (`S`) with Lahiri sidereal mode. Planetary calculations and IST->UTC conversion are unchanged.
