# Be1 Space
[find your perfect space here](https://be1space.vercel.app/)

**Be1 Space** is a study spot discovery platform built for NYU students. Find cafes, libraries, lounges, and coworking spaces around Washington Square — filter by noise level, WiFi, price, and more, then save your favorites.

Built as part of **[tech@nyu](https://techatnyu.org)'s Tech Treks program**, a student-run initiative that gives NYU students hands-on experience shipping real products.

---

## Features

- **Discover** — Browse study spaces with real-time search and multi-filter support (noise level, WiFi, price, type, laptop-friendliness, NYU discounts)
- **Interactive Map** — Explore spots visually on Google Maps with geolocation and per-space info windows
- **NYU Section** — Curated spaces for `@nyu.edu` users: student favorites, on-campus spots, and discount locations
- **Favorites** — Save spaces and see global favorite counts across all users
- **Profile** — Track recently visited spaces, manage notification and privacy preferences
- **Auth** — Email/password sign-up and login via Supabase Auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide React |
| Maps | Google Maps API |
| Database & Auth | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── discover/            # Space discovery + filtering
│   ├── map/                 # Interactive Google Maps view
│   ├── nyu/                 # NYU-exclusive curated spaces
│   ├── favorites/           # Saved spaces
│   ├── profile/             # User profile + settings
│   ├── stores/[id]/         # Individual space detail page
│   ├── signin/ signup/      # Authentication pages
│   └── api/
│       ├── auth/            # Login + signup endpoints
│       ├── spaces/          # Space listing, detail, map, popular
│       ├── profiles/        # User profile + favorites CRUD
│       ├── maps/            # Google Maps JS proxy, photo proxy, Places API
│       └── occupancy/       # Occupancy voting
├── components/
│   ├── SpaceCard.jsx
│   ├── AuthButton.js
│   └── Stars.jsx
├── context/
│   └── AuthContext.js
└── lib/
    └── supabase.js, api.js, spaces.js, favorites.js, auth.js
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/spaces` | List spaces (supports filter params) |
| GET | `/api/spaces/[id]` | Space detail by Google Place ID |
| GET | `/api/spaces/map` | Spaces with coordinates |
| GET | `/api/spaces/popular` | Top favorited spaces |
| GET/POST | `/api/profiles/[id]/favorites` | Get or add favorites |
| DELETE | `/api/profiles/[id]/favorites/[spaceId]` | Remove favorite |
| GET | `/api/maps/js` | Server-side Google Maps JS proxy |
| GET | `/api/maps/places/[placeId]` | Place details from Google Places API |
| GET | `/api/maps/photo` | Google Place photo proxy |

---

## Database Schema (Supabase)

**`spaces`** — `google_place_id`, `name`, `address`, `latitude`, `longitude`, `price_range`, `noise_level`, `wifi`, `laptop_friendly`, `nyu_discount`, `tags`, `vibe`, `description`, `image_url`

**`profiles`** — `id` (Supabase Auth UID), `username`, `email`

**`favorites`** — `user_id`, `space_id` — junction table for user ↔ space favorites

---

## About Tech Treks

[Tech Treks](https://techatnyu.org) is a program run by **tech@nyu**, NYU's largest technology club. It pairs students with mentors and resources to build and ship real software projects over a semester. Be1 Space was built through this program.

