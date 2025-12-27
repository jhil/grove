# Plangrove Features

## Status Legend
- ✅ Complete
- 🚧 In Progress
- 📋 Planned
- 💡 Idea

---

## Core Features

### Project Setup
- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS 4 with custom theme
- ✅ Base UI components (migrated from Radix UI)
- ✅ TanStack Query setup
- ✅ Supabase client setup (browser + server)
- ✅ Motion animations library
- ✅ Lucide React icons
- ✅ Testing infrastructure (Vitest + React Testing Library)

### UI Components
- ✅ Button (all variants: primary, secondary, ghost, accent, water, destructive)
- ✅ Card (default, elevated, interactive)
- ✅ Input, Label, Textarea
- ✅ Dialog (Base UI modal dialogs with animations)
- ✅ Select (Base UI dropdown)
- ✅ Combobox (Base UI autocomplete for plant search)
- ✅ Toast/Notifications (success, error, info variants)
- ✅ Progress bar (with watering variant)
- ✅ Skeleton loaders (generic + plant card + grove header)
- ✅ Confetti (celebration animations)
- ✅ Motion components (fade, slide, scale animations)

### Grove Feature
- ✅ Create grove with name
- ✅ Generate shareable URL (human-readable slugs)
- ✅ View grove page with all plants
- ✅ Edit grove settings (rename)
- ✅ Delete grove with confirmation
- ✅ Grove health dashboard
- ✅ Grove statistics (plant count, watering needs)
- ✅ My Groves list (for signed-in users)

### Plant Feature
- ✅ Add plant to grove
- ✅ Edit plant details
- ✅ Delete plant with confirmation
- ✅ Plant photo upload (Supabase Storage)
- ✅ Comprehensive plant database (~188 species with watering data)
- ✅ Plant type autocomplete with fuzzy search
- ✅ Watering interval auto-populated from plant database
- ✅ Plant notes

### Water Tracking
- ✅ Water button with animation
- ✅ Last watered display
- ✅ Next watering calculation
- ✅ Status indicators (healthy/warning/urgent/overdue)
- ✅ Watering progress bar
- ✅ Smart watering recommendations

### Views & Organization
- ✅ Gallery view (card grid)
- ✅ List view (compact rows)
- ✅ Compact view (minimal)
- ✅ Sort by urgency (default)
- ✅ Sort by name (A-Z)
- ✅ Sort by date added
- ✅ Sort by plant type

### Real-time Sync
- ✅ Supabase realtime subscription
- ✅ Live updates across devices
- ✅ Query invalidation on changes

### Activity & History
- ✅ Activity changelog component
- ✅ Track grove activities
- ✅ Display activity feed

### Weather Integration
- ✅ Weather widget (Open-Meteo API)
- ✅ Local temperature display
- ✅ Weather condition icons
- ✅ Location search with geocoding (Nominatim API)
- ✅ Persistent location preference

### Delight Features
- ✅ Sound effects (Web Audio API synthesized)
- ✅ Motion animations throughout
- ✅ Confetti on milestones
- ✅ AI plant name generator
- ✅ Empty state illustrations

### Authentication (Optional)
- ✅ Supabase Auth integration
- ✅ Sign in dialog
- ✅ Track who watered plants (when signed in)
- ✅ My Groves for signed-in users
- ✅ Works without auth (collaborative by default)

### PWA Support
- ✅ Web manifest
- ✅ App icons
- ✅ Mobile-optimized viewport

### Deployment
- ✅ Cloudflare Workers deployment
- ✅ OpenNext adapter
- ✅ Custom domain (plangrove.app)
- ✅ Environment variables configuration

---

## Enhanced Features (Future Ideas)

### 💡 Plant Personalities
Give plants fun moods based on care status.

### 💡 Care Streaks
Track consecutive successful waterings.

### 💡 Team Leaderboards
"Who's the best plant parent this month?"

### 💡 Plant Growth Timeline
Photo diary showing plant growth over time.

### 💡 Care Handoff
"Going on vacation? Hand off your plants."

### 💡 Plant Milestones
Celebrate plant birthdays, first flower, etc.

### 💡 Grove Analytics
Dashboard showing care patterns over time.

### 💡 Push Notifications
"Hey, Fernie is thirsty!" reminders.

---

## Technical Debt

- [x] Add comprehensive unit tests (Vitest + React Testing Library)
- [ ] Add E2E tests with Playwright
- [ ] Implement error boundaries
- [ ] Add more loading states
- [ ] Image optimization improvements
- [ ] Accessibility audit (WCAG compliance)
- [ ] Performance profiling

---

## Last Updated
December 27, 2025
