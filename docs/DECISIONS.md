# Design Decisions

This document records key technical and design decisions for future reference.

---

## 2024-12-26: Base UI over shadcn/ui

**Decision**: Use Base UI instead of shadcn/ui for component primitives.

**Context**: Initially planned to use shadcn/ui, but switched based on user preference.

**Rationale**:
- Base UI is more lightweight and unstyled
- Gives full control over design without fighting presets
- Better for creating a unique visual identity
- Simpler component structure

**Trade-offs**:
- More styling work required upfront
- Fewer pre-built complex components
- Need to implement more from scratch

---

## 2024-12-26: Tailwind CSS 4 with OKLCH Colors

**Decision**: Use Tailwind CSS 4 with OKLCH color space.

**Rationale**:
- OKLCH provides perceptually uniform colors
- Better for creating harmonious palettes
- Modern approach that works well with custom themes

---

## 2024-12-26: No Authentication

**Decision**: Build without user authentication.

**Context**: Plangrove is designed for collaborative plant care where anyone with a link can participate.

**Rationale**:
- Reduces friction for collaboration
- Simpler architecture
- Grove URLs serve as access control
- Matches use case (office plants, shared spaces)

**Trade-offs**:
- No user-specific features (personal settings)
- Can't track who did what
- Potential for vandalism (acceptable for MVP)

---

## 2024-12-26: Human-readable Grove IDs

**Decision**: Use slugified names as grove IDs instead of UUIDs.

**Example**: `/grove/office-plants-2024` instead of `/grove/a1b2c3d4`

**Rationale**:
- Better user experience when sharing links
- Easier to remember and type
- More personal/friendly feeling

**Trade-offs**:
- Need to handle slug conflicts
- Slightly more complex ID generation

---

## 2024-12-26: "Greenhouse Warmth" Theme

**Decision**: Create a custom warm, organic color palette.

**Colors**:
- Sage greens (primary)
- Terracotta (accent)
- Cream (backgrounds)
- Soft blue (water UI)

**Rationale**:
- Differentiate from typical tech UI
- Match the plant/nature subject matter
- Feel warm and inviting, not clinical
- Playful but not childish

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
