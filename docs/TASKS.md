# Human Tasks

This file tracks tasks that need to be completed by the user (not automated by Claude Code).

## Pending Tasks

### Supabase Auth Configuration

- [ ] **[T-004]** Verify Supabase Auth Settings
  In Supabase Dashboard > Authentication > URL Configuration:
  - Site URL: `https://plangrove.app`
  - Redirect URLs should include:
    - `https://plangrove.app/**`
    - `https://plangrove.app/auth/callback`
    - `http://localhost:3000/**` (for local dev)
    - `http://localhost:3000/auth/callback`

### Cloudflare Deployment

- [ ] **[T-003]** Deploy to Cloudflare after all features are complete
  ```bash
  pnpm build:cf && pnpm deploy
  ```

---

## Completed Tasks

### 2025-12-27
- [x] **[T-000]** Configure Supabase Auth redirect URL to `https://plangrove.app`
- [x] **[T-001]** Run Migration 001: Care Streaks & Milestones
- [x] **[T-002]** Run Migration 002: Plant Growth Timeline

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
- Account page is at `/account`
