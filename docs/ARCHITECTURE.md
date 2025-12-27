# Plangrove Architecture

## Overview

Plangrove is a collaborative plant care webapp built with:
- **Next.js 15** (App Router) - Framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with custom "Greenhouse Warmth" theme
- **Base UI** - Accessible component primitives (from MUI)
- **Supabase** - Database, auth (optional), real-time, storage
- **TanStack Query** - Data fetching and caching
- **Motion** - Animations
- **Cloudflare Workers** - Edge deployment via OpenNext
- **Vitest** - Unit and component testing

## Directory Structure

```
grove/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Theme and global styles
│   ├── providers.tsx       # React context providers
│   ├── not-found.tsx       # 404 page
│   ├── create-grove/       # Grove creation flow
│   ├── grove/[id]/         # Grove detail view
│   └── shop/               # Shop page (future)
│
├── components/
│   ├── ui/                 # Base UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── combobox.tsx    # Autocomplete for plant search
│   │   ├── confetti.tsx
│   │   ├── dialog.tsx      # Base UI Dialog
│   │   ├── input.tsx
│   │   ├── motion.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx      # Base UI Select
│   │   ├── skeleton.tsx
│   │   └── toast.tsx
│   ├── grove/              # Grove-specific components
│   │   ├── grove-changelog.tsx
│   │   ├── grove-header.tsx
│   │   ├── grove-health.tsx
│   │   ├── grove-settings.tsx
│   │   ├── grove-stats.tsx
│   │   ├── my-groves.tsx
│   │   ├── sort-selector.tsx
│   │   ├── view-mode-selector.tsx
│   │   └── weather-widget.tsx
│   ├── plant/              # Plant-specific components
│   │   ├── name-generator.tsx
│   │   ├── plant-card.tsx
│   │   ├── plant-form.tsx
│   │   ├── plant-grid.tsx
│   │   ├── plant-photo.tsx
│   │   ├── plant-views.tsx
│   │   ├── water-button.tsx
│   │   └── watering-recommendation.tsx
│   ├── shared/             # Shared components
│   │   ├── empty-state.tsx
│   │   └── header.tsx
│   ├── auth/               # Authentication components
│   │   └── auth-dialog.tsx
│   ├── home/               # Home page components
│   ├── onboarding/         # Onboarding flow
│   └── analytics.tsx       # Analytics component
│
├── hooks/                  # React hooks
│   ├── use-activities.ts   # Activity feed data
│   ├── use-auth.tsx        # Supabase authentication
│   ├── use-grove.ts        # Grove data fetching
│   ├── use-my-groves.ts    # User's groves list
│   ├── use-onboarding.ts   # Onboarding state
│   ├── use-photo-upload.ts # Image upload to Supabase
│   ├── use-plants.ts       # Plant CRUD operations
│   ├── use-realtime.ts     # Supabase realtime subscriptions
│   ├── use-sort.ts         # Sort state management
│   ├── use-sound.tsx       # Web Audio sound effects
│   └── use-view-mode.ts    # View mode state
│
├── lib/
│   ├── supabase/           # Supabase clients
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server client
│   ├── database/           # Database operations
│   ├── data/               # Static data
│   │   └── plants.ts       # Plant database (~188 species)
│   └── utils/              # Utilities
│       ├── cn.ts           # Class name merging
│       ├── dates.ts        # Date formatting
│       └── geocoding.ts    # Location search (Nominatim)
│
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
├── docs/                   # Documentation
├── __tests__/              # Test files
│   ├── components/         # Component tests
│   └── lib/                # Utility tests
│
├── open-next.config.ts     # OpenNext configuration
├── wrangler.jsonc          # Cloudflare Workers config
├── vitest.config.ts        # Vitest configuration
├── vitest.setup.ts         # Test setup (mocks)
└── next.config.ts          # Next.js configuration
```

## Data Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Browser   │ ──> │ TanStack Query  │ ──> │   Supabase   │
│  Component  │ <── │   (Cache)       │ <── │   Database   │
└─────────────┘     └─────────────────┘     └──────────────┘
                            │
                    ┌───────┴───────┐
                    │   Realtime    │
                    │  Subscription │
                    └───────────────┘
```

## Database Schema

### Tables

- **groves**: Plant collections with shareable URLs
  - `id` (TEXT) - Human-readable slug (primary key)
  - `name` (TEXT) - Display name
  - `cover_photo` (TEXT) - Optional cover image URL
  - `created_at`, `updated_at` (TIMESTAMPTZ)

- **plants**: Individual plants in a grove
  - `id` (UUID) - Primary key
  - `grove_id` (TEXT) - Foreign key to groves
  - `name` (TEXT) - Plant name
  - `type` (TEXT) - Plant type (succulent, tropical, etc.)
  - `watering_interval` (INTEGER) - Days between watering
  - `photo` (TEXT) - Optional photo URL
  - `notes` (TEXT) - Optional care notes
  - `last_watered` (TIMESTAMPTZ) - Last watering timestamp
  - `created_at`, `updated_at` (TIMESTAMPTZ)

### Access Control

No authentication required for basic operations - all tables have public read/write access via RLS policies. This is intentional for collaborative plant care.

Optional authentication via Supabase Auth enables:
- Tracking who watered plants
- "My Groves" feature for signed-in users

## Key Design Decisions

1. **Optional Auth**: Auth-free by default for frictionless collaboration, sign-in for bonus features
2. **Human-readable IDs**: Grove IDs are slugs for better URLs
3. **Optimistic Updates**: Water actions update instantly via TanStack Query
4. **Real-time Sync**: Changes propagate to all viewers via Supabase realtime
5. **Base UI**: Accessible component primitives with full design control
6. **Edge Deployment**: Cloudflare Workers for global low latency
7. **Static Plant Database**: ~188 species with watering data, no API dependencies
8. **Free APIs Only**: Open-Meteo for weather, Nominatim for geocoding

## Theme: "Greenhouse Warmth"

Custom color palette using OKLCH:
- **Sage**: Primary greens (buttons, healthy states)
- **Terracotta**: Warm accents (highlights, urgency)
- **Cream**: Background tones
- **Water**: Blue for watering UI

See `app/globals.css` for full theme definition.

## Deployment

### Infrastructure
- **Hosting**: Cloudflare Workers (edge)
- **Adapter**: OpenNext (@opennextjs/cloudflare)
- **Domain**: plangrove.app
- **Database**: Supabase (hosted PostgreSQL)
- **Storage**: Supabase Storage (plant photos)

### Build & Deploy
```bash
pnpm build:cf    # Build for Cloudflare
pnpm deploy      # Deploy to production
```

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (safe to expose)

Set in both `.env.local` (local) and Cloudflare dashboard (production).

## External APIs

- **Supabase**: Database, auth, real-time, storage
- **Open-Meteo**: Weather data (free, no API key)
- **Nominatim** (OpenStreetMap): Geocoding for location search (free, no API key)

## Performance Considerations

- TanStack Query caching reduces redundant requests
- Optimistic updates for instant UI feedback
- Real-time subscriptions for live sync without polling
- Edge deployment for global low latency
- Static generation where possible
