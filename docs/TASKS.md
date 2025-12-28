# Human Tasks

This file tracks tasks that need to be completed by the user (not automated by Claude Code).

## Pending Tasks

### 2025-12-27
- [ ] **[T-005]** Test security headers on production after deploy (use securityheaders.com)
- [ ] **[T-006]** Run Lighthouse audit and document Core Web Vitals baseline
- [ ] **[T-007]** Set up E2E test infrastructure with Playwright (`npx playwright install`)

---

## Completed Tasks

### 2025-12-27
- [x] **[T-000]** Configure Supabase Auth redirect URL to `https://plangrove.app`
- [x] **[T-001]** Run Migration 001: Care Streaks & Milestones
- [x] **[T-002]** Run Migration 002: Plant Growth Timeline
- [x] **[T-003]** Deploy to Cloudflare (https://plangrove.jahilnbrand.workers.dev)
- [x] **[T-004]** Verify Supabase Auth redirect URLs include `/auth/callback`

---

## Migration Reference

All SQL migrations are documented in `docs/MIGRATIONS.md` with full SQL scripts.

| Task ID | Migration | Description |
|---------|-----------|-------------|
| T-001 | Migration 001 | streak_count, best_streak, streak_started_at, birthday fields |
| T-002 | Migration 002 | plant_photos table for growth timeline |

---

## Notes

- After running migrations, test the feature locally before deploying
- Environment variables should already be set in Cloudflare dashboard
- Auth callback route is at `/auth/callback`
- Profile page is at `/profile`
