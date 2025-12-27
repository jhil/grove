# Database Migrations

Run these SQL commands in the Supabase SQL Editor to set up the required tables.

## Migration 2: User Profiles and Watering Events

Add this after the initial grove/plants schema is set up.

```sql
-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles (for displaying who watered)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Watering events table - records who watered what plant
CREATE TABLE IF NOT EXISTS watering_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  grove_id TEXT NOT NULL REFERENCES groves(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT, -- Denormalized for display even if user is deleted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for watering events
CREATE INDEX idx_watering_events_plant_id ON watering_events(plant_id);
CREATE INDEX idx_watering_events_grove_id ON watering_events(grove_id);
CREATE INDEX idx_watering_events_created_at ON watering_events(created_at DESC);

-- RLS for watering events
ALTER TABLE watering_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view watering events (public groves)
CREATE POLICY "Public watering events"
ON watering_events FOR SELECT USING (true);

-- Authenticated users can insert watering events
CREATE POLICY "Authenticated users can insert watering events"
ON watering_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime for watering events
ALTER PUBLICATION supabase_realtime ADD TABLE watering_events;

-- Auto-update profiles timestamp
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to get recent activity for a grove
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

- `profiles` table stores user display info
- `watering_events` records each watering action with who did it
- `user_name` is denormalized so history is preserved even if user deletes account
- The `get_grove_activity` function provides a convenient way to fetch recent activity
