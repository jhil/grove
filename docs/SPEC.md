# Plangrove Specification

A collaborative plant care platform where multiple users can share and care for plants together.

## Vision

Plangrove should feel like stepping into a cozy, sunlit greenhouse - warm, inviting, and alive. The aesthetic is organic and furniture-like, inspired by designer websites like those featured on godly.website. It's not a typical SaaS app but something that feels good, organic, beautiful, fun yet serene.

## Features

### Core Features
- **Collaborative Grove Creation**: Create shared plant spaces accessible via unique links
- **Public URLs**: Share grove links that work across devices and users
- **Water Tracking**: Track watering history and upcoming needs
- **Real-time Sync**: Changes sync across all users via Supabase
- **Plant Photos**: Upload photos to track plant growth

### Smart Features
- **Name Generator**: Fun, creative plant name suggestions
- **Watering Recommendations**: Smart suggestions based on plant type
- **Care Tips**: Contextual advice for each plant type
- **Weather Widget**: Local weather info using Open-Meteo API

### View & Organization
- **Multiple View Modes**: Gallery, List, and Compact views
- **Urgency Sorting**: Plants sorted by watering urgency
- **Activity Changelog**: Track all grove activity

### Delight Features
- **Motion Animations**: Subtle, organic animations using Motion
- **Sound Effects**: Synthesized sounds for actions (Web Audio API)
- **Organic Design**: Muted pastels, rounded shapes, soft shadows

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom organic theme
- **Components**: Radix UI for accessible primitives
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL + Real-time)
- **State**: TanStack Query
- **Animation**: Motion (motion/react)

## Design System

### Color Philosophy
- **Sage greens**: Life, growth, health (muted, not neon)
- **Terracotta**: Warmth, earth, ceramics
- **Cream**: Paper, sunlight, softness
- **Water blue**: Used sparingly for watering actions

### Shape Language
- Cards: `rounded-2xl` (organic but not childish)
- Buttons: `rounded-xl` (approachable)
- Pills/badges: `rounded-full` (playful)
- No sharp corners anywhere

### Motion
- Transitions: 200ms ease-out
- Hover: subtle lift
- Success: gentle pulse
- Water action: ripple animation

## Database Schema

### groves
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `cover_photo` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### plants
- `id` (UUID, PRIMARY KEY)
- `grove_id` (TEXT, FK to groves)
- `name` (TEXT)
- `type` (TEXT)
- `watering_interval` (INTEGER, days)
- `photo` (TEXT, nullable)
- `notes` (TEXT, nullable)
- `last_watered` (TIMESTAMPTZ, nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Privacy Model

- **Public by design**: Groves are collaborative and accessible
- **No authentication**: Anyone with a link can participate
- **Row Level Security**: Public read/write with data integrity
- **No personal data**: Only plant and grove information stored

## Target Users

- **Office plant crews**: Shared responsibility, friendly competition
- **Roommates**: "Who watered the fiddle leaf fig?"
- **Community gardens**: Multiple caretakers, many plants
- **Plant-obsessed friends**: Sharing across households
