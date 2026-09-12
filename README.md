# Spark — Dating App Demo

A lightweight, polished Tinder/Bumble-style dating web app demo.

Perfect for advertising or showcasing on Vercel.

## Features

- Beautiful mobile-first UI
- Swipe cards (drag or buttons)
- Match celebration modal
- Matches list (persisted in localStorage)
- Profile page
- No backend / no signup required

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo
4. Click **Deploy**

That's it — no environment variables needed.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide icons
- localStorage for demo state

## Demo Notes

- Profiles are mock data with Unsplash photos
- ~45% chance of mutual match when you like someone (for demo fun)
- "Reset Demo Data" on the Profile page clears everything
