# SmartPark Flow

SmartPark Flow is a Next.js app showcasing a modern “smart parking” product experience:

- Marketing landing with glassmorphism UI
- A dedicated dashboard area (nested routes)
- Cinematic 3D experiences (initial loader + dark mode animated background)

## Key features

- Marketing pages: `Discover`, `Pricing`, `Features`, `About`, `Mobile App`, `Careers`, `Blog`, `Press`, `Help`, `Contact`, `Privacy`, `Terms`
- Auth pages: `Login`, `Register` (premium design placeholders)
- Dashboard routes:
  - `/dashboard`
  - `/dashboard/discover`
  - `/dashboard/reservations`
  - `/dashboard/charging`
  - `/dashboard/payments`
  - `/dashboard/settings`
  - `/dashboard/help`
- 3D / Three.js:
  - Initial loader animation (star cloud assembling into a sphere)
  - Dark mode animated background
- Theme + language switching (state managed via Zustand)

## Tech stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (app state)
- React Three Fiber + Drei + Three.js (3D)
- Framer Motion (micro-interactions)

## Getting started

Prerequisites:

- Node.js 18+
- npm

Install and run:

```bash
npm install
npm run dev
```

The dev server runs on: `http://localhost:8080`

## Scripts

- `npm run dev`: start Next dev server (port 8080)
- `npm run build`: production build
- `npm run start`: start production server (port 8080)
- `npm run lint`: run ESLint

## Project structure (high level)

- `src/app`:
  - `(landing)/*`: marketing + auth pages
  - `(dashboard)/dashboard/*`: dashboard layout and sub-pages
- `src/components`:
  - `layout/*`: navbar/footer
  - `threejs/*`: 3D loader and dark mode background
- `src/store/*`: Zustand store (theme/language/loader triggers)

## Notes

This repository contains both Next.js App Router pages and some legacy React Router code. The active dev script (`npm run dev`) runs Next.js.
