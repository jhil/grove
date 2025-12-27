# Plangrove

A collaborative plant care app for teams, roommates, and plant lovers.

**Live at [plangrove.app](https://plangrove.app)**

## Design

Plangrove features a refined, editorial design inspired by Scandinavian minimalism:
- **Serene animations** with 300ms transitions and ease-out curves
- **Full-width layouts** with asymmetric, edge-to-edge compositions
- **Mobile-optimized** for modern iPhones (SE, 14, 15 Pro)
- **Touch-friendly** with 44px minimum tap targets

## Features

- **Collaborative Groves** - Create shared plant spaces with unique shareable links
- **Water Tracking** - Track when plants were watered and when they need water next
- **277 Plant Database** - Searchable plant types with scientific names and care data
- **Smart Recommendations** - Get watering suggestions based on plant type
- **Multiple Views** - Gallery, list, and compact view modes
- **Real-time Sync** - Changes sync instantly across all devices
- **Activity Changelog** - See who watered what and when
- **Weather Widget** - Local weather with custom location via geocoding
- **Sound Effects** - Satisfying audio feedback for actions
- **Motion Animations** - Smooth, serene animations throughout
- **PWA Support** - Installable on mobile devices
- **Optional Sign-in** - Works without accounts, but sign in to track your contributions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Supabase account (free tier works)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Groves table
CREATE TABLE groves (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cover_photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plants table
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grove_id TEXT NOT NULL REFERENCES groves(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  watering_interval INTEGER NOT NULL,
  photo TEXT,
  notes TEXT,
  last_watered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_plants_grove_id ON plants(grove_id);
CREATE INDEX idx_plants_last_watered ON plants(last_watered);

-- RLS Policies (public access)
ALTER TABLE groves ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public groves" ON groves FOR ALL USING (true);
CREATE POLICY "Public plants" ON plants FOR ALL USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE groves;
ALTER PUBLICATION supabase_realtime ADD TABLE plants;
```

### Running Locally

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Run tests
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Capture mobile screenshots (Playwright)
npx tsx scripts/mobile-screenshots.ts
```

Visit `http://localhost:3000`

### Mobile Screenshots

Screenshots are captured for visual regression testing and stored in `.screenshots/`:

```bash
npx tsx scripts/mobile-screenshots.ts
```

Devices tested: iPhone 15 Pro, iPhone 14, iPhone SE

## Deployment

Plangrove is deployed to Cloudflare Workers using OpenNext.

### Build for Cloudflare

```bash
pnpm build:cf
```

### Deploy

```bash
pnpm deploy
```

### Environment Variables (Production)

Set these in the Cloudflare dashboard (Workers & Pages > plangrove > Settings > Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Base UI (from MUI)
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **State**: TanStack Query
- **Animation**: Motion
- **Testing**: Vitest + React Testing Library
- **Deployment**: Cloudflare Workers (OpenNext)

## Project Structure

```
grove/
├── app/              # Next.js pages
├── components/       # React components
│   ├── ui/           # Base UI primitives (Dialog, Select, Combobox)
│   ├── grove/        # Grove-specific components
│   ├── plant/        # Plant-specific components
│   └── shared/       # Shared components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and clients
│   ├── data/         # Static data (plant database)
│   └── utils/        # Utilities (geocoding, dates)
├── types/            # TypeScript types
├── public/           # Static assets
├── __tests__/        # Test files
└── docs/             # Documentation
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System overview and data flow
- [Components](docs/COMPONENTS.md) - Component library reference
- [Features](docs/FEATURES.md) - Feature status and roadmap
- [Decisions](docs/DECISIONS.md) - Technical decision log
- [Specification](docs/SPEC.md) - Product specification

## License

MIT
