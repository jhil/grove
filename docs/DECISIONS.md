# Design Decisions

This document records key technical and design decisions for future reference.

---

## 2024-12-26: Base UI for Component Primitives

**Decision**: Use Base UI (from MUI) for all component primitives.

**Context**: Needed accessible, unstyled component primitives for building custom UI. Initially used Radix UI, but migrated to Base UI.

**Rationale**:
- Base UI provides excellent accessibility out of the box
- Unstyled by default, giving full design control
- Well-documented with React-first API
- Good composition patterns with render props
- Active maintenance by MUI team
- Consistent API across all components

**Trade-offs**:
- Requires more styling work than pre-styled alternatives
- Fewer community examples than Radix UI

---

## 2024-12-26: Tailwind CSS 4 with OKLCH Colors

**Decision**: Use Tailwind CSS 4 with OKLCH color space.

**Rationale**:
- OKLCH provides perceptually uniform colors
- Better for creating harmonious palettes
- Modern approach that works well with custom themes
- CSS custom properties for easy theming

---

## 2024-12-26: Optional Authentication

**Decision**: Build with optional Supabase Auth - app works without login, but sign-in adds features.

**Context**: Plangrove is designed for collaborative plant care where anyone with a link can participate.

**Rationale**:
- Reduces friction for collaboration (no account needed to water)
- Grove URLs serve as access control
- Signed-in users get bonus features (track who watered, My Groves list)
- Matches use case (office plants, shared spaces)

**Trade-offs**:
- Anonymous users can't be tracked
- Potential for vandalism (acceptable for MVP)
- More complex state management (auth optional)

---

## 2024-12-26: Human-readable Grove IDs

**Decision**: Use slugified names as grove IDs instead of UUIDs.

**Example**: `/grove/office-plants-2024` instead of `/grove/a1b2c3d4`

**Rationale**:
- Better user experience when sharing links
- Easier to remember and type
- More personal/friendly feeling
- SEO benefits

**Trade-offs**:
- Need to handle slug conflicts
- Slightly more complex ID generation
- Less secure (guessable, but acceptable for public groves)

---

## 2024-12-26: "Greenhouse Warmth" Theme

**Decision**: Create a custom warm, organic color palette.

**Colors**:
- Sage greens (primary actions, healthy states)
- Terracotta (accent, urgency indicators)
- Cream (backgrounds)
- Soft blue (water UI)

**Rationale**:
- Differentiate from typical tech UI
- Match the plant/nature subject matter
- Feel warm and inviting, not clinical
- Playful but not childish

---

## 2024-12-26: Motion Library for Animations

**Decision**: Use Motion (motion/react) for animations.

**Rationale**:
- Production-ready animation library
- Declarative API fits React patterns
- Hardware-accelerated animations
- Good support for gesture animations
- Layout animations out of the box

**Trade-offs**:
- Adds bundle size (~30KB gzipped)
- Learning curve for complex animations

---

## 2024-12-26: Web Audio API for Sound Effects

**Decision**: Use Web Audio API with synthesized sounds instead of audio files.

**Rationale**:
- No audio files to load/manage
- Smaller bundle size
- Instant playback (no loading delay)
- Can dynamically adjust sounds
- Works offline

**Trade-offs**:
- More complex to create sounds
- Less realistic than recorded audio
- Browser compatibility considerations

---

## 2024-12-26: TanStack Query for Server State

**Decision**: Use TanStack Query (React Query) for all server state management.

**Rationale**:
- Excellent caching and invalidation
- Built-in loading/error states
- Optimistic updates for water actions
- Works well with Supabase
- Reduces boilerplate

**Trade-offs**:
- Another library to learn
- Query key management complexity

---

## 2024-12-26: Open-Meteo for Weather API

**Decision**: Use Open-Meteo free API for weather data.

**Rationale**:
- Completely free, no API key required
- No rate limiting for reasonable use
- Good accuracy for basic weather data
- Simple REST API

**Trade-offs**:
- Less detailed than paid alternatives
- No hyperlocal data
- Limited historical data

---

## 2024-12-27: Cloudflare Workers Deployment

**Decision**: Deploy to Cloudflare Workers using OpenNext adapter.

**Context**: Needed edge deployment for global performance.

**Rationale**:
- Edge deployment for low latency worldwide
- Generous free tier
- Easy custom domain setup
- Good integration with Cloudflare ecosystem
- OpenNext provides Next.js compatibility

**Trade-offs**:
- Workers have execution limits (CPU time, memory)
- Some Next.js features not fully supported
- OpenNext is still maturing

---

## 2024-12-27: Next.js 15.3.3 (Not 16)

**Decision**: Downgrade from Next.js 16 to 15.3.3 for production.

**Context**: Next.js 16 has a `setImmediate` compatibility issue with Cloudflare Workers.

**Rationale**:
- Next.js 16 throws `TypeError: Cannot assign to read only property 'setImmediate'` on Workers
- OpenNext PR #1055 addresses this but not yet released
- 15.3.3 is stable and works with OpenNext

**Trade-offs**:
- Missing Next.js 16 features
- Need to monitor for fix and upgrade later
- Pinned version may miss security patches

---

## 2024-12-27: Environment Variables Strategy

**Decision**: Use `NEXT_PUBLIC_*` prefix for Supabase credentials.

**Context**: Supabase anon key is designed to be public (RLS provides security).

**Rationale**:
- Anon key is safe to expose (Row Level Security handles authorization)
- Client-side queries work without server proxy
- Simpler architecture
- Real-time subscriptions work directly

**Trade-offs**:
- Credentials visible in client bundle
- Must ensure RLS policies are correct
- Service role key must NEVER be exposed

---

## 2025-12-27: Comprehensive Plant Database

**Decision**: Create a static JSON database of ~188 plant species with watering data.

**Context**: Initially had only 9 hardcoded plant types. Users need accurate watering recommendations.

**Rationale**:
- Static data means no API costs or dependencies
- Includes watering intervals (min/ideal/max days)
- Supports fuzzy search with Combobox autocomplete
- Categories: succulent, tropical, fern, flowering, herb, tree, vine, cactus, aquatic, carnivorous
- Includes scientific names, sunlight/humidity requirements, difficulty ratings

**Trade-offs**:
- Manual curation required for updates
- Not as comprehensive as paid plant APIs
- ~188 species covers most common houseplants

---

## 2025-12-27: Nominatim API for Geocoding

**Decision**: Use OpenStreetMap's Nominatim API for location search in weather widget.

**Context**: Weather widget needed user-configurable location instead of hardcoded coordinates.

**Rationale**:
- Completely free, no API key required
- No rate limiting for reasonable use
- Good accuracy for city-level geocoding
- Same free-tier philosophy as Open-Meteo weather API

**Trade-offs**:
- Must respect usage policy (no heavy use)
- Less accurate than paid alternatives for addresses
- Requires user-agent header

---

## 2025-12-27: Vitest for Testing

**Decision**: Use Vitest with React Testing Library for unit/component tests.

**Context**: Needed testing infrastructure compatible with Next.js 15 and TypeScript.

**Rationale**:
- Native TypeScript support
- Fast execution with Vite
- Jest-compatible API (easy migration)
- Works well with React Testing Library
- jsdom environment for component tests

**Trade-offs**:
- Separate config from Next.js
- Some Next.js-specific features need mocking

---

## 2025-12-27: Security Headers Strategy

**Decision**: Implement comprehensive security headers via Next.js config.

**Context**: Needed to harden the application against common web vulnerabilities.

**Headers Added**:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` - Disables unused APIs
- `Content-Security-Policy` - Restricts resource loading to trusted sources

**CSP Configuration**:
- `default-src 'self'` - Default to same-origin
- Scripts: self, inline (required by Next.js), Google Tag Manager
- Styles: self, inline (required for Tailwind)
- Images: self, data URIs, Supabase storage
- Connect: Supabase, Open-Meteo, Nominatim, Google Analytics
- Frames: none (frame-ancestors 'none')

**Rationale**:
- Defense in depth against XSS, clickjacking, and data injection
- Next.js config approach keeps headers in version control
- CSP restricts what resources can load, limiting attack surface
- Cloudflare Workers also provides additional protection at edge

**Trade-offs**:
- CSP requires `unsafe-inline` for styles/scripts (Next.js requirement)
- May need updates when adding new external services
- Strict CSP can break features if not configured correctly

---

## 2025-12-27: Accessibility-First Approach

**Decision**: Implement WCAG 2.1 AA accessibility standards throughout the application.

**Context**: Accessibility audit revealed gaps in screen reader support and keyboard navigation.

**Improvements Made**:
- Toast notifications with `aria-live` regions (polite/assertive based on type)
- Plant card menus with proper `aria-expanded`, `aria-haspopup`, `role="menu"`
- Form inputs with `aria-required` and `aria-invalid` states
- Section landmarks with `aria-labelledby` for navigation
- Skip-to-content link for keyboard users
- Loading states with `aria-busy` indicators

**Rationale**:
- Base UI components provide accessible primitives
- ARIA attributes fill gaps for custom interactive components
- Keyboard navigation essential for motor-impaired users
- Screen reader support critical for visually impaired users

**Trade-offs**:
- Additional attributes increase code complexity
- Need to test with actual screen readers
- Some dynamic content still needs aria-live improvements

---

## Future Decisions

Document new decisions here as they're made.

Template:
```
## YYYY-MM-DD: Decision Title

**Decision**: What was decided.

**Context**: Why this decision was needed.

**Rationale**: Why this option was chosen.

**Trade-offs**: What we gave up.
```
