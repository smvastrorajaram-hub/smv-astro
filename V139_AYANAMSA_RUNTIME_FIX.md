V139 Ayanamsa Runtime Fix

Fixed compatibility with sweph 2.10.3-7 get_ayanamsa_ut(): the binding may expose the ayanamsa as a number or as {flag,error,data}. The engine now normalizes both forms and keeps Lahiri as the configured sidereal mode.
