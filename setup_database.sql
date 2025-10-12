-- ============================================
-- JUDGING SYSTEM DATABASE SETUP
-- ============================================
-- Run this script in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/dhpfxourfmccblvdwcjy/sql
-- ============================================

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  start_date timestamptz,
  end_date timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create judges table
CREATE TABLE IF NOT EXISTS judges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  category text CHECK (category IN ('Software', 'Hardware')),
  token text UNIQUE NOT NULL,
  invitation_sent boolean DEFAULT false,
  invitation_sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  category_id text CHECK (category_id IN ('software', 'hardware', 'Software', 'Hardware')),
  project_title text DEFAULT '',
  project_description text DEFAULT '',
  members jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create criteria table
CREATE TABLE IF NOT EXISTS criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  weight numeric DEFAULT 1,
  max_score numeric DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create judge_team_assignments table
CREATE TABLE IF NOT EXISTS judge_team_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(judge_id, team_id)
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  criterion_key text NOT NULL,
  score numeric NOT NULL CHECK (score >= 0 AND score <= 10),
  round integer DEFAULT 1,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(judge_id, team_id, criterion_key, round)
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update their events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete their events" ON events;

DROP POLICY IF EXISTS "Anyone can view judges" ON judges;
DROP POLICY IF EXISTS "Authenticated users can create judges" ON judges;
DROP POLICY IF EXISTS "Authenticated users can update judges" ON judges;
DROP POLICY IF EXISTS "Authenticated users can delete judges" ON judges;

DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can update teams" ON teams;
DROP POLICY IF EXISTS "Authenticated users can delete teams" ON teams;

DROP POLICY IF EXISTS "Anyone can view criteria" ON criteria;
DROP POLICY IF EXISTS "Authenticated users can create criteria" ON criteria;
DROP POLICY IF EXISTS "Authenticated users can update criteria" ON criteria;
DROP POLICY IF EXISTS "Authenticated users can delete criteria" ON criteria;

DROP POLICY IF EXISTS "Anyone can view assignments" ON judge_team_assignments;
DROP POLICY IF EXISTS "Authenticated users can create assignments" ON judge_team_assignments;
DROP POLICY IF EXISTS "Authenticated users can update assignments" ON judge_team_assignments;
DROP POLICY IF EXISTS "Authenticated users can delete assignments" ON judge_team_assignments;

DROP POLICY IF EXISTS "Anyone can view scores" ON scores;
DROP POLICY IF EXISTS "Anyone can create scores" ON scores;
DROP POLICY IF EXISTS "Anyone can update scores" ON scores;
DROP POLICY IF EXISTS "Authenticated users can delete scores" ON scores;

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete their events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for judges
CREATE POLICY "Anyone can view judges"
  ON judges FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create judges"
  ON judges FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update judges"
  ON judges FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete judges"
  ON judges FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for teams
CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for criteria
CREATE POLICY "Anyone can view criteria"
  ON criteria FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create criteria"
  ON criteria FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update criteria"
  ON criteria FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete criteria"
  ON criteria FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for judge_team_assignments
CREATE POLICY "Anyone can view assignments"
  ON judge_team_assignments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create assignments"
  ON judge_team_assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assignments"
  ON judge_team_assignments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete assignments"
  ON judge_team_assignments FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for scores
CREATE POLICY "Anyone can view scores"
  ON scores FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create scores"
  ON scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update scores"
  ON scores FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete scores"
  ON scores FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_judges_event_id ON judges(event_id);
CREATE INDEX IF NOT EXISTS idx_judges_token ON judges(token);
CREATE INDEX IF NOT EXISTS idx_teams_event_id ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_criteria_event_id ON criteria(event_id);
CREATE INDEX IF NOT EXISTS idx_judge_team_assignments_judge_id ON judge_team_assignments(judge_id);
CREATE INDEX IF NOT EXISTS idx_judge_team_assignments_team_id ON judge_team_assignments(team_id);
CREATE INDEX IF NOT EXISTS idx_scores_judge_id ON scores(judge_id);
CREATE INDEX IF NOT EXISTS idx_scores_team_id ON scores(team_id);
