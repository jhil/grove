# Database Migrations

Run this SQL in the Supabase SQL Editor to set up all required tables.

## Complete Schema Setup

```sql
-- =====================================================
-- GROVES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS groves (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cover_photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grove_id TEXT NOT NULL REFERENCES groves(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  watering_interval INTEGER NOT NULL,
  photo TEXT,
  notes TEXT,
  last_watered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for plants
CREATE INDEX IF NOT EXISTS idx_plants_grove_id ON plants(grove_id);
CREATE INDEX IF NOT EXISTS idx_plants_last_watered ON plants(last_watered);

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WATERING EVENTS TABLE
-- Records who watered what plant and when
-- =====================================================
CREATE TABLE IF NOT EXISTS watering_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  grove_id TEXT NOT NULL REFERENCES groves(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT, -- Denormalized for display even if user is deleted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for watering events
CREATE INDEX IF NOT EXISTS idx_watering_events_plant_id ON watering_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_watering_events_grove_id ON watering_events(grove_id);
CREATE INDEX IF NOT EXISTS idx_watering_events_created_at ON watering_events(created_at DESC);

-- =====================================================
-- AUTO-UPDATE TIMESTAMPS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_groves_timestamp ON groves;
CREATE TRIGGER update_groves_timestamp
BEFORE UPDATE ON groves
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_plants_timestamp ON plants;
CREATE TRIGGER update_plants_timestamp
BEFORE UPDATE ON plants
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE groves ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watering_events ENABLE ROW LEVEL SECURITY;

-- Groves: Public access (anyone can create/read/update)
DROP POLICY IF EXISTS "Public groves select" ON groves;
CREATE POLICY "Public groves select" ON groves FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public groves insert" ON groves;
CREATE POLICY "Public groves insert" ON groves FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public groves update" ON groves;
CREATE POLICY "Public groves update" ON groves FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public groves delete" ON groves;
CREATE POLICY "Public groves delete" ON groves FOR DELETE USING (true);

-- Plants: Public access (anyone can create/read/update/delete)
DROP POLICY IF EXISTS "Public plants select" ON plants;
CREATE POLICY "Public plants select" ON plants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public plants insert" ON plants;
CREATE POLICY "Public plants insert" ON plants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public plants update" ON plants;
CREATE POLICY "Public plants update" ON plants FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public plants delete" ON plants;
CREATE POLICY "Public plants delete" ON plants FOR DELETE USING (true);

-- Profiles: Public read, user-specific write
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Watering events: Public read, anyone can insert
DROP POLICY IF EXISTS "Public watering events select" ON watering_events;
CREATE POLICY "Public watering events select"
ON watering_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert watering events" ON watering_events;
CREATE POLICY "Anyone can insert watering events"
ON watering_events FOR INSERT WITH CHECK (true);

-- =====================================================
-- REALTIME PUBLICATION
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE groves;
ALTER PUBLICATION supabase_realtime ADD TABLE plants;
ALTER PUBLICATION supabase_realtime ADD TABLE watering_events;

-- =====================================================
-- STORAGE BUCKET FOR PLANT PHOTOS
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-photos', 'plant-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for plant photos
DROP POLICY IF EXISTS "Public plant photos read" ON storage.objects;
CREATE POLICY "Public plant photos read"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-photos');

DROP POLICY IF EXISTS "Anyone can upload plant photos" ON storage.objects;
CREATE POLICY "Anyone can upload plant photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plant-photos');

DROP POLICY IF EXISTS "Anyone can update plant photos" ON storage.objects;
CREATE POLICY "Anyone can update plant photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'plant-photos');

DROP POLICY IF EXISTS "Anyone can delete plant photos" ON storage.objects;
CREATE POLICY "Anyone can delete plant photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'plant-photos');

-- =====================================================
-- HELPER FUNCTION: GET GROVE ACTIVITY
-- Returns recent watering events for a grove
-- =====================================================
CREATE OR REPLACE FUNCTION get_grove_activity(p_grove_id TEXT, p_limit INT DEFAULT 20)
RETURNS TABLE (
  id UUID,
  event_type TEXT,
  plant_id UUID,
  plant_name TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    we.id,
    'watered'::TEXT as event_type,
    we.plant_id,
    p.name as plant_name,
    COALESCE(we.user_name, 'Someone') as user_name,
    we.created_at
  FROM watering_events we
  JOIN plants p ON p.id = we.plant_id
  WHERE we.grove_id = p_grove_id
  ORDER BY we.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

## Notes

- **groves**: Stores grove information (name, cover photo)
- **plants**: Individual plants within a grove
- **profiles**: User profile data linked to Supabase Auth
- **watering_events**: Records each watering action with who did it
- **user_name** is denormalized so history is preserved even if user deletes account
- **plant-photos** storage bucket for uploading plant images
- All tables have public read access for collaborative features
- Profiles require authentication for insert/update

---

## Incremental Migrations

### Migration 001: Add Care Streaks and Plant Milestones (2025-12-27)

Run this SQL to add streak tracking and plant birthday fields:

```sql
-- =====================================================
-- CARE STREAKS & MILESTONES FIELDS
-- =====================================================

-- Add streak tracking fields to plants
ALTER TABLE plants
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_started_at TIMESTAMPTZ;

-- Add plant birthday for milestones
ALTER TABLE plants
ADD COLUMN IF NOT EXISTS birthday TIMESTAMPTZ;

-- Set default values for existing plants
UPDATE plants SET streak_count = 0 WHERE streak_count IS NULL;
UPDATE plants SET best_streak = 0 WHERE best_streak IS NULL;
```

**Description:**
- `streak_count`: Current consecutive on-time waterings
- `best_streak`: All-time best streak for this plant
- `streak_started_at`: When the current streak began
- `birthday`: Plant's "birthday" (when you got it) for milestone celebrations

---

### Migration 002: Plant Growth Timeline (2025-12-27)

Run this SQL to add the plant_photos table for growth timeline:

```sql
-- =====================================================
-- PLANT PHOTOS TABLE (Growth Timeline)
-- =====================================================

CREATE TABLE IF NOT EXISTS plant_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plant_photos_plant_id ON plant_photos(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_photos_taken_at ON plant_photos(taken_at);

-- RLS Policies
ALTER TABLE plant_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public plant_photos select" ON plant_photos FOR SELECT USING (true);
CREATE POLICY "Public plant_photos insert" ON plant_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public plant_photos delete" ON plant_photos FOR DELETE USING (true);
```

**Description:**
- `plant_photos`: Stores multiple photos per plant for growth tracking
- Photos are ordered by `taken_at` date to create a timeline
- Each photo can have an optional caption
