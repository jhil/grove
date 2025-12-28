# Design System

## Icon Guidelines

Plangrove uses [Lucide](https://lucide.dev) icons with a nature-inspired theme. Use icons consistently across the app to maintain visual coherence.

### Core Icons

| Icon | Usage | Notes |
|------|-------|-------|
| `Flower` | Brand logo, main app identity | Primary brand icon |
| `HouseHeart` | Grove (collection of plants) | Represents a shared space with love |
| `Sprout` | Plant, seedling, growth | Individual plants |
| `CircleUser` | User profile | Account-related contexts |
| `Check` | Save, confirm, success | Use instead of `Save` icon |
| `Bug` | Errors, issues, problems | On theme with nature vibe |

### Contextual Icons

| Icon | Usage |
|------|-------|
| `Droplets` | Watering, hydration |
| `Users` | Collaboration, groups |
| `ShoppingBasket` | Shop, commerce |
| `Bell` | Notifications |
| `Settings` | Configuration |
| `ArrowRight` | Navigation, CTAs |
| `Plus` | Add new item |
| `LogOut` | Sign out |
| `Loader2` | Loading states (animated) |

### Icon Sizing

- Navigation logos: `w-3.5 h-3.5`
- Section headers: `w-5 h-5`
- Large hero/empty states: `w-8 h-8`
- List items: `w-4 h-4`
- Buttons: `w-4 h-4`

### Icon Containers

Icons in containers use rounded backgrounds:
- Small: `w-6 h-6 rounded-md`
- Medium: `w-7 h-7 rounded-lg` or `w-8 h-8 rounded-lg`
- Large: `w-10 h-10 rounded-lg` or `w-12 h-12 rounded-xl`
- Extra large: `w-16 h-16 rounded-2xl`

Standard container styling:
```tsx
<div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
  <IconName className="w-5 h-5" />
</div>
```

---

## Color Palette

### Primary Colors (Terracotta)
- `terracotta-50` through `terracotta-900`: Warm earthy orange tones
- Primary text on dark: `text-white`, `text-terracotta-200`, `text-terracotta-300`
- Primary containers: `bg-terracotta-100`
- Primary buttons/CTAs: `bg-terracotta-500`

### Supporting Colors (Sage)
- `sage-50` through `sage-900`: Green-gray earthy tones (use sparingly, ~20-30%)
- Reserved for plant health indicators and nature accents
- `cream-50`: Warm off-white for backgrounds
- `water-*`: Soft blue for water-related UI

### Color Philosophy
Terracotta is our hero color - it differentiates us from typical green plant apps. Green appears as a supporting accent for nature-related contexts. The warm palette creates an inviting, earthy feel inspired by Daylight Computer and Samara.

### Semantic Colors
- Success: Terracotta tones
- Error: Deep red-ish destructive color
- Warning: Terracotta tones

---

## Typography

### Font
Plangrove uses **Denim INK** by [Displaay Type Foundry](https://displaay.net/typeface/denim-collection/denim-ink-wd/). A sans-serif typeface with rounded inner corners inspired by screenprinting on denim fabric.

### Text Sizes
- Hero headlines: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`
- Section headings: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- Subheadings: `text-xl` or `text-2xl`
- Body: `text-base` or `text-lg`
- Labels: `text-sm`
- Overlines: `text-sm tracking-wide uppercase`

### Font Weights
- Headlines: `font-semibold`
- Subheadings: `font-medium`
- Body: default (400)

---

## Spacing

### Page Layout
- Horizontal padding: `px-6 lg:px-12`
- Section vertical padding: `py-12` to `py-20`
- Component gaps: `gap-4` to `gap-8`

### Content Containers
- Max widths: `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-2xl`, `max-w-4xl`

---

## Motion

Import transitions from `@/lib/motion`:
- `transition.enter`: Quick entrance (200ms)
- `transition.slow`: Slower, elegant (400ms)
- Stagger delays: `delay: index * 0.05` or similar
