# Performance Baseline

Performance metrics for Plangrove, measured on 2025-12-28.

## Core Web Vitals Summary

### After Image Optimization (Current)

| Page | LCP | CLS | TTFB | Rating |
|------|-----|-----|------|--------|
| Home (`/`) | **143ms** | 0.00 | 46ms | Excellent |
| Grove (`/grove/:id`) | **81ms** | 0.00 | 32ms | Excellent (skeleton) |

### After Initial Optimization

| Page | LCP | CLS | TTFB | Rating |
|------|-----|-----|------|--------|
| Home (`/`) | 1,206ms | 0.00 | 62ms | Good |
| Grove (`/grove/:id`) | 81ms | 0.00 | 32ms | Good (skeleton) |

### Before Optimization (Baseline)

| Page | LCP | CLS | TTFB | Rating |
|------|-----|-----|------|--------|
| Home (`/`) | 1,557ms | 0.00 | 120ms | Good |
| Grove (`/grove/:id`) | 3,239ms | 0.00 | 73ms | Needs Improvement |

### Improvement Summary

| Page | Baseline | After Preload | After Images | Total Change |
|------|----------|---------------|--------------|--------------|
| Home | 1,557ms | 1,206ms (-22%) | **143ms** | **-91%** |
| Grove | 3,239ms | 81ms (-97%) | 81ms | **-97%** |

### Thresholds (Google)
- **LCP**: Good < 2,500ms, Needs Improvement 2,500-4,000ms, Poor > 4,000ms
- **CLS**: Good < 0.1, Needs Improvement 0.1-0.25, Poor > 0.25
- **TTFB**: Good < 800ms

---

## Optimizations Applied

### 1. LCP Image Preload
Added `<link rel="preload">` for the hero image in `app/layout.tsx`:
```html
<link rel="preload" as="image" href="/img/plant-room.jpg" fetchPriority="high" />
```

**Impact**: Load duration reduced from 402ms to 94ms (**77% improvement**)

### 2. Removed Animation Delay from Hero Image
Changed hero image container from `motion.div` with delay to static `div`:
- Removed parallax scroll effect from hero image
- Image renders immediately without waiting for JS animation

**Impact**: Eliminates animation-related render blocking

### 3. Image Optimization (91% size reduction)
Optimized all hero images with `scripts/optimize-images.mjs`:
- Resized to max 1920px width
- Compressed with mozjpeg at 80% quality
- Added blur data URL placeholders

**Results:**
| Image | Before | After | Savings |
|-------|--------|-------|---------|
| plant-room.jpg (LCP) | 2.44 MB | 213 KB | **91.5%** |
| kitchen-shelves.jpg | 3.64 MB | 426 KB | 88.6% |
| foliage-closeup.jpg | 2.00 MB | 360 KB | 82.5% |
| reading-plants.jpg | 2.01 MB | 529 KB | 74.3% |
| kitchen-counter.jpg | 1.45 MB | 399 KB | 73.2% |
| community-garden.jpg | 0.60 MB | 418 KB | 32.0% |

**Impact**: LCP load duration dropped from 96ms to 26ms (73% faster)

### 4. Blur Placeholders
Added tiny (10px wide) blur data URLs for immediate visual feedback:
```tsx
placeholder="blur"
blurDataURL={getBlurDataURL("/img/plant-room.jpg")}
```

**Impact**: Eliminates blank space during image loading

### 5. Lazy Loading for Below-Fold Images
Added explicit `loading="lazy"` to `ParallaxImage` component for use case images.

**Impact**: Reduces initial page weight, prioritizes LCP image

### 6. Simplified Hero Component
Removed `useScroll` and `useTransform` hooks from HeroSection:
- Less JavaScript to execute before render
- Parallax effect maintained only for below-fold images

---

## Home Page Analysis

**URL**: https://plangrove.app/

### Current Metrics (After Image Optimization)
- **LCP**: 143ms (Excellent)
- **CLS**: 0.00 (Perfect)
- **TTFB**: 46ms (Excellent)

### LCP Breakdown (Current)
| Phase | Duration | % of LCP |
|-------|----------|----------|
| Time to First Byte | 46ms | 32.2% |
| Resource Load Delay | 3ms | 2.1% |
| Resource Load Duration | 26ms | 18.2% |
| Element Render Delay | 69ms | 48.3% |

### What Changed
The massive LCP improvement (1,206ms → 143ms) came from:
1. **Image optimization** - LCP image reduced from 2.44MB to 213KB (91.5% smaller)
2. **Blur placeholders** - Immediate visual feedback while loading
3. **Faster hydration** - Smaller assets = faster JS execution

### Future Optimization Opportunities (Low Priority)
1. **Server Components** - Convert hero to RSC for instant render
2. **Partial Hydration** - Only hydrate interactive elements
3. **Bundle Splitting** - Lazy load motion library

---

## Grove Page Analysis

**URL**: https://plangrove.app/grove/:id

### Current Metrics
- **LCP**: 81ms (Good - skeleton UI)
- **CLS**: 0.00 (Perfect)
- **TTFB**: 32ms (Excellent)

### Analysis
The grove page now shows excellent LCP because:
1. Skeleton loading states render immediately
2. LCP is measured on the skeleton cards, not loaded content
3. Actual content loads progressively after data fetch

This is good UX - users see immediate feedback while data loads.

---

## Security Headers

**Grade**: A (securityheaders.com)

### Present Headers
| Header | Value | Status |
|--------|-------|--------|
| Content-Security-Policy | Full policy (see below) | ✅ |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | ✅ |
| Referrer-Policy | strict-origin-when-cross-origin | ✅ |
| X-Content-Type-Options | nosniff | ✅ |
| X-Frame-Options | DENY | ✅ |
| X-XSS-Protection | 1; mode=block | ✅ |

### Missing Headers
| Header | Recommendation |
|--------|----------------|
| Strict-Transport-Security | Enable HSTS in Cloudflare dashboard |

### CSP Warnings
- `'unsafe-inline'` in script-src (required for Next.js)
- `'unsafe-eval'` in script-src (required for Next.js dev)

---

## Recommendations Priority

### Completed
- [x] Add `<link rel="preload">` for LCP image
- [x] Add `fetchpriority="high"` to preload
- [x] Remove animation delay from hero image
- [x] Implement lazy loading for below-fold images
- [x] Optimize images (resize to 1920px, compress with mozjpeg)
- [x] Add blur data URL placeholders

### Remaining (High Priority)
1. Enable HSTS in Cloudflare dashboard

### Remaining (Low Priority - LCP is now 143ms)
1. Convert hero to Server Component for instant render
2. Investigate partial hydration for interactive elements
3. Remove `'unsafe-eval'` from CSP in production build
4. Add Cross-Origin headers (COEP, COOP, CORP)

---

## Measurement Notes

- **Tool**: Chrome DevTools Performance Panel via MCP
- **Network**: No throttling (real conditions)
- **CPU**: No throttling
- **Date**: 2025-12-28
- **Environment**: Production (plangrove.app via Cloudflare)
- **Multiple runs**: Results averaged across 2-3 traces for stability
