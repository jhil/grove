# Plangrove Architecture

## Overview

Plangrove is a collaborative plant care webapp built with:
- **Next.js 15** (App Router) - Framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling with custom "Greenhouse Warmth" theme
- **Base UI** - Unstyled accessible components
- **Supabase** - Database, auth (none), real-time, storage
- **TanStack Query** - Data fetching and caching

## Directory Structure

```
grove/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Theme and global styles
│   ├── create-grove/       # Grove creation flow
│   └── grove/[id]/         # Grove detail view
│
├── components/
│   ├── ui/                 # Base UI primitives (Button, Card, etc.)
│   ├── grove/              # Grove-specific components
│   ├── plant/              # Plant-specific components
│   └── shared/             # Shared components (Header, etc.)
│
├── lib/
│   ├── supabase/           # Supabase clients (browser, server)
│   ├── database/           # Database operations
│   └── utils/              # Utilities (cn, dates, etc.)
│
├── hooks/                  # React hooks for data fetching
├── types/                  # TypeScript type definitions
├── tests/                  # Test utilities and mocks
├── e2e/                    # Playwright E2E tests
└── docs/                   # Documentation for agents
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

No authentication - all tables have public read/write access via RLS policies.
This is intentional for collaborative plant care.

## Key Design Decisions

1. **No Auth**: Intentionally auth-free for frictionless collaboration
2. **Human-readable IDs**: Grove IDs are slugs for better URLs
3. **Optimistic Updates**: Water actions update instantly
4. **Real-time Sync**: Changes propagate to all viewers
5. **Base UI**: Unstyled components for full design control

## Theme: "Greenhouse Warmth"

Custom color palette using OKLCH:
- **Sage**: Primary greens (buttons, healthy states)
- **Terracotta**: Warm accents (highlights, urgency)
- **Cream**: Background tones
- **Water**: Blue for watering UI

See `app/globals.css` for full theme definition.
