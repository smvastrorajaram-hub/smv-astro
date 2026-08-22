/*
 SMV ASTRO V142 - Birth Place Location Helper
 ---------------------------------------------
 UI/backend integration helper. The application should call this module
 through a server-side geocoding endpoint or a trusted geocoding provider.
 It deliberately does not expose API keys in frontend code.

 Recommended UX:
 - Start suggestions after 2-3 characters.
 - Display "City, State, Country".
 - On selection, store place, latitude and longitude.
 - Horoscope calculation must use the selected coordinates, not free text.
*/
(function (global) {
  "use strict";

  function normalizePlaceResult(item) {
    if (!item) return null;
    var lat = Number(item.lat ?? item.latitude);
    var lon = Number(item.lon ?? item.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

    return {
      place: item.display_name || item.place || item.name || "",
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lon.toFixed(6))
    };
  }

  function shouldSearch(value) {
    return typeof value === "string" && value.trim().length >= 2;
  }

  global.SMVLocation = {
    normalizePlaceResult: normalizePlaceResult,
    shouldSearch: shouldSearch
  };
})(window);
