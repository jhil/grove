# Plangrove

A collaborative plant care app for teams, roommates, and plant lovers.

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

-- RLS Policies
ALTER TABLE groves ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public groves" ON groves FOR ALL USING (true);
CREATE POLICY "Public plants" ON plants FOR ALL USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE groves;
ALTER PUBLICATION supabase_realtime ADD TABLE plants;
```

### Running

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

Visit `http://localhost:3000`

## Features

- Create shared plant groves with unique shareable links
- Track watering schedules with smart recommendations
- Multiple view modes (gallery, list, compact)
- Real-time sync across devices
- Activity changelog
- Weather widget
- Subtle sound effects and animations

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase
- TanStack Query
- Motion
- Radix UI

## Documentation

See [docs/SPEC.md](docs/SPEC.md) for detailed specification.
