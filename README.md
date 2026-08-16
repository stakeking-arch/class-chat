# Class Chat

A WhatsApp-style chat app for your class. Real accounts, real-time messages, works on phones as an installable app (no App Store needed).

## What this is built with
- **Frontend:** React + Vite (a fast web app framework)
- **Backend:** Supabase (free hosted database + auth + real-time — no server to manage)
- Installs on phones like a native app via "Add to Home Screen" (PWA)

## Setup (about 15 minutes)

### 1. Create a free Supabase project
1. Go to https://supabase.com and sign up (free tier is plenty for a class).
2. Click **New Project**. Pick any name/password/region.
3. Once it's created, go to **SQL Editor** in the left sidebar.
4. Open `supabase-schema.sql` from this folder, copy all of it, paste into the SQL Editor, and click **Run**.
   This creates the tables (profiles, rooms, messages) and security rules.
5. Go to **Project Settings → API**. Copy your **Project URL** and **anon public key**.

### 2. Configure the app
1. In this project folder, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and paste in your Supabase URL and anon key.

### 3. Run it locally to test
```
npm install
npm run dev
```
Open the printed local URL. Sign up with an email, check that email for a confirmation link, then log in.

### 4. Deploy so your class can use it
Easiest option — **Vercel** (free):
1. Push this folder to a GitHub repo.
2. Go to https://vercel.com, sign in with GitHub, click **New Project**, pick the repo.
3. In the "Environment Variables" step, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as your `.env`).
4. Click Deploy. You'll get a live link like `class-chat.vercel.app`.

Share that link with your class. On a phone, opening the link and choosing **"Add to Home Screen"** (Safari) or **"Install app"** (Chrome) puts it on their home screen like a real app, with its own icon — no App Store required.

### 5. Adding more chat rooms
In Supabase, go to **Table Editor → rooms** and add a row (e.g. "Homework Help", "Announcements"). It appears in the app instantly.

## Notes
- Email confirmation is on by default. If you want people to skip that step (e.g. no easy classroom email check), go to **Authentication → Providers → Email** in Supabase and turn off "Confirm email."
- The `icon.png` in `public/` is a placeholder solid color — swap it for your own logo (192x192 and 512x512 PNGs).
- Everyone who signs up can see all rooms and messages, similar to a class group chat. If you later want private/DM chats, that's a schema change — just ask.
