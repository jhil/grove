# Human Tasks

This file tracks tasks that need to be completed by the user (not automated by Claude Code).

## Pending Tasks

### Supabase Migrations

- [x] **Run Migration 001: Care Streaks & Milestones** (Required for new features)
  ```sql
  -- Run in Supabase SQL Editor
  ALTER TABLE plants
  ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS birthday TIMESTAMPTZ;

  UPDATE plants SET streak_count = 0 WHERE streak_count IS NULL;
  UPDATE plants SET best_streak = 0 WHERE best_streak IS NULL;
  ```

- [x] **Run Migration 002: Plant Growth Timeline** (Required for growth timeline)
  ```sql
  -- Run in Supabase SQL Editor
  CREATE TABLE IF NOT EXISTS plant_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    taken_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_plant_photos_plant_id ON plant_photos(plant_id);
  CREATE INDEX IF NOT EXISTS idx_plant_photos_taken_at ON plant_photos(taken_at);

  ALTER TABLE plant_photos ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Public plant_photos select" ON plant_photos FOR SELECT USING (true);
  CREATE POLICY "Public plant_photos insert" ON plant_photos FOR INSERT WITH CHECK (true);
  CREATE POLICY "Public plant_photos delete" ON plant_photos FOR DELETE USING (true);
  ```

### Cloudflare Deployment

- [ ] **Deploy to Cloudflare** after features are complete
  ```bash
  pnpm build:cf && pnpm deploy
  ```

---

## Completed Tasks

### 2025-12-27
- [x] Configure Supabase Auth redirect URL to `https://plangrove.app`

---

## Notes

- Migrations are also documented in `docs/MIGRATIONS.md`
- After running migrations, test the feature locally before deploying
- Environment variables should already be set in Cloudflare dashboard
