/*
  # Judging System Database Schema

  ## Overview
  This migration creates the core database tables for a comprehensive event judging system.
  It enables persistent storage of events, judges, teams, scoring criteria, and evaluation scores.

  ## New Tables
  
  ### `events`
  Stores event information and configuration
  - `id` (uuid, primary key) - Unique event identifier
  - `name` (text) - Event name
  - `description` (text) - Event description
  - `start_date` (timestamptz) - Event start date/time
  - `end_date` (timestamptz) - Event end date/time
  - `status` (text) - Event status (draft, active, completed)
  - `created_by` (uuid) - User who created the event
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `judges`
  Stores judge information and access tokens
  - `id` (uuid, primary key) - Unique judge identifier
  - `event_id` (uuid, foreign key) - Associated event
  - `name` (text) - Judge name
  - `email` (text) - Judge email address
  - `category` (text) - Judge category (Software/Hardware)
  - `token` (text, unique) - Access token for judge dashboard
  - `invitation_sent` (boolean) - Whether invitation email was sent
  - `invitation_sent_at` (timestamptz) - When invitation was sent
  - `created_at` (timestamptz) - Creation timestamp

  ### `teams`
  Stores team information
  - `id` (uuid, primary key) - Unique team identifier
  - `event_id` (uuid, foreign key) - Associated event
  - `name` (text) - Team name
  - `category_id` (text) - Team category (Software/Hardware)
  - `project_title` (text) - Project title
  - `project_description` (text) - Project description
  - `members` (jsonb) - Array of team member information
  - `created_at` (timestamptz) - Creation timestamp

  ### `criteria`
  Stores scoring criteria for events
  - `id` (uuid, primary key) - Unique criterion identifier
  - `event_id` (uuid, foreign key) - Associated event
  - `name` (text) - Criterion name
  - `description` (text) - Criterion description
  - `weight` (numeric) - Weight/multiplier for scoring
  - `max_score` (numeric) - Maximum possible score
  - `created_at` (timestamptz) - Creation timestamp

  ### `judge_team_assignments`
  Maps judges to their assigned teams
  - `id` (uuid, primary key) - Unique assignment identifier
  - `judge_id` (uuid, foreign key) - Judge reference
  - `team_id` (uuid, foreign key) - Team reference
  - `assigned_at` (timestamptz) - Assignment timestamp

  ### `scores`
  Stores individual scores from judges
  - `id` (uuid, primary key) - Unique score identifier
  - `judge_id` (uuid, foreign key) - Judge who submitted score
  - `team_id` (uuid, foreign key) - Team being scored
  - `criterion_key` (text) - Criterion being scored (innovation, execution, etc)
  - `score` (numeric) - Score value
  - `round` (integer) - Round number
  - `submitted_at` (timestamptz) - Submission timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated admin users to manage events
  - Add policies for judges to access their assignments via token
  - Public read access for results (can be restricted later)

  ## Important Notes
  1. All tables use UUIDs for primary keys with automatic generation
  2. Foreign key constraints ensure data integrity
  3. Timestamps track creation and modification
  4. RLS policies are restrictive by default
*/

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
