V146 Tamil Location Backend Fix

Fixed the legacy Tamil location autocomplete handler that referenced BACKEND_URL outside its scope.
Tamil Birth Place autocomplete now calls the same Render backend used by English: /api/geocode.
English/Tamil horoscope sections remain separate; no global website language selector is restored.
