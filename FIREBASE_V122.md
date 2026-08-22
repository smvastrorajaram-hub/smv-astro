# SMV ASTRO V122 — Astrology Engine + Firebase Rules

Includes V121 Tamil Vedic astrology calculation engine plus Firebase deployment files.

## Firebase security
Added owner-only client access for:
- `smv_horoscopes`
- `smv_birth_charts`
- `smv_horoscope_reports`

Admins retain access. The rules prevent one signed-in customer from reading another customer's horoscope.

## Important
The `/api/horoscope/calculate` backend uses Firebase Admin SDK, so Firestore security rules do not restrict that trusted server calculation. If the server later persists generated charts, it should write the `userId` matching the authenticated user.

## Deploy
firebase deploy --only firestore:rules,firestore:indexes
