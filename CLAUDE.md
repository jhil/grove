# Plangrove - Claude Code Instructions

This file provides guidance for AI assistants working on the Plangrove codebase.

## Project Overview

Plangrove is a collaborative plant care app built with Next.js, Supabase, and Tailwind CSS. It helps groups of people (roommates, offices, communities) track and coordinate plant watering.

## Documentation Structure

The `/docs` directory contains important project documentation. **Always consult these files before making changes:**

### Core Documentation

| File               | Purpose                               | When to Use                                                                                              |
| ------------------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `DECISIONS.md`     | Architectural Decision Records (ADRs) | Before making major technical decisions. Add new ADRs for significant choices.                           |
| `FEATURES.md`      | Feature list and roadmap              | When implementing features. Check what exists, what's planned.                                           |
| `TASKS.md`         | Human tasks for the user              | When you identify something the human must do (deploy, configure, test manually). Give tasks unique IDs. |
| `DESIGN.md`        | Icon guidelines and design system     | When using icons or creating UI. Follow the icon mapping strictly.                                       |
| `VOICE.md`         | Voice and tone guidelines             | **When writing any user-facing copy.** Follow the "serenely playful" voice.                              |
| `ARCHITECTURE.md`  | System architecture overview          | When understanding how components connect.                                                               |
| `COMPONENTS.md`    | Component documentation               | When using or creating components.                                                                       |
| `SPEC.md`          | Original product specification        | For understanding product intent.                                                                        |
| `ACCESSIBILITY.md` | WCAG compliance notes                 | When implementing UI.                                                                                    |

## Key Guidelines

### 1. Recording Decisions

When you make a significant architectural or technical decision:

1. Add an ADR to `docs/DECISIONS.md`
2. Use the format: `## ADR-XXX: Title`
3. Include: Context, Decision, Consequences

### 2. Human Tasks

When you identify something the human user needs to do:

1. Add it to `docs/TASKS.md` with a unique ID like `[T-XXX]`
2. Include clear instructions
3. Mark tasks as completed when done with `[x]`

### 3. Feature Tracking

Before implementing features:

1. Check `docs/FEATURES.md` for existing functionality
2. Update the feature list when adding new features
3. Note any technical debt in the appropriate section

### 4. Voice & Tone

All user-facing copy must follow `docs/VOICE.md`. Key principles:

- **Serenely playful** - calm like a garden, but warm and friendly
- Avoid corporate jargon ("collaborate", "streamline", "optimize")
- Prefer friendly language ("plant with friends", "care together", "grow together")
- See the voice doc for before/after examples

### 5. Icons

Follow the icon mapping in `docs/DESIGN.md`:

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (motion/react)
- **Icons**: Lucide React
- **Deployment**: Cloudflare (OpenNext)

## Code Patterns

### Components

- Use the components in `/components/ui/` for consistency
- Follow the motion patterns in `/lib/motion.ts`
- Use the custom hooks in `/hooks/`

### Styling

- Use the custom color palette (sage, terracotta, cream)
- Follow the shadow utilities (shadow-soft, shadow-lifted)
- Use transition classes (transition-serene, transition-interaction)

### State Management

- Auth state: `useAuth()` hook
- Grove data: `useGrove()` hook
- Local grove storage: `useMyGroves()` hook

## Common Tasks

### Adding a new page

1. Create file in `/app/[route]/page.tsx`
2. Follow existing page patterns for layout
3. Use the Header component or create custom nav
4. Add appropriate loading.tsx if needed

### Adding a new component

1. Create in appropriate `/components/` subdirectory
2. Export from the directory index if applicable
3. Document props with TypeScript interfaces
4. Follow the design system colors and spacing

### Database changes

1. Create migration in Supabase dashboard
2. Document in `docs/MIGRATIONS.md`
3. Update TypeScript types if needed
