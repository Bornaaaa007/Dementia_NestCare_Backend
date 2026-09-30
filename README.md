# NestCare Backend (Express + MongoDB Atlas + Better Auth)

1. `npm install`
2. Copy `.env.example` to `.env` and fill in values
3. `npm run dev`

Auth routes are served under `/api/auth/*` (sign-up: `/api/auth/sign-up/email`, sign-in: `/api/auth/sign-in/email`).
`GET /api/me` and all `/patients` routes require a logged-in session.

Expo client: copy `expo-client/src/lib/auth-client.ts` into your Expo app and run
`npx expo install expo-secure-store` then `npm install better-auth @better-auth/expo`.
