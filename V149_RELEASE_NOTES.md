SMV ASTRO V149 - ENGLISH HOROSCOPE / DASHA / LOGIN-NAV FIX

Fixes:
1. English horoscope no longer calls applyEnglishToHoroscope() or
   bindHoroscopeInteractions() through an inaccessible lexical scope.
   Both helpers are exported on window and the English section calls them safely.
2. English horoscope result receives its own AI button binding with language=en.
3. English Vimshottari Dasha Mahadasha/Bhukti/Antara/Pratyantara controls
   are rebound after rendering/copying and support click/touch.
4. Dasha current/next summary and nested Bhukti/Pratyantara data remain visible.
5. Login continues to hide all public horoscope sections.
6. Clicking the header "தமிழ் ஜாதகம்" link explicitly restores BOTH Tamil and
   English public horoscope sections and scrolls to the Tamil section.
7. No global Tamil/English website selector has been restored.
