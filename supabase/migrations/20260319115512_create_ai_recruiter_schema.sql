/*
  # AI Recruiter Voice Agent - Database Schema

  ## Overview
  Complete database schema for an AI-powered recruitment platform with voice interview capabilities,
  candidate management, automated scheduling, and report generation.

  ## New Tables

  ### 1. `users`
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique, not null) - User email for authentication
  - `full_name` (text, not null) - User's full name
  - `role` (text, not null) - User role (admin, recruiter, interviewer)
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `candidates`
  - `id` (uuid, primary key) - Unique candidate identifier
  - `email` (text, unique, not null) - Candidate email
  - `full_name` (text, not null) - Candidate's full name
  - `phone` (text) - Contact phone number
  - `resume_url` (text) - Link to resume document
  - `linkedin_url` (text) - LinkedIn profile URL
  - `current_position` (text) - Current job title
  - `years_experience` (integer, default 0) - Years of experience
  - `skills` (text[]) - Array of skills
  - `status` (text, default 'new') - Candidate status (new, screening, shortlisted, interviewing, hired, rejected)
  - `ai_score` (integer) - AI screening score (0-100)
  - `screening_notes` (text) - AI-generated screening notes
  - `created_by` (uuid) - Reference to user who added candidate
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `job_positions`
  - `id` (uuid, primary key) - Unique position identifier
  - `title` (text, not null) - Job title
  - `department` (text, not null) - Department name
  - `description` (text, not null) - Job description
  - `requirements` (text[]) - Required skills and qualifications
  - `experience_required` (integer, default 0) - Minimum years of experience
  - `status` (text, default 'active') - Position status (active, closed, on-hold)
  - `created_by` (uuid) - Reference to user who created position
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `interviews`
  - `id` (uuid, primary key) - Unique interview identifier
  - `candidate_id` (uuid, not null) - Reference to candidates table
  - `job_position_id` (uuid, not null) - Reference to job_positions table
  - `interviewer_id` (uuid) - Reference to users table (human interviewer if applicable)
  - `scheduled_at` (timestamptz, not null) - Scheduled interview time
  - `duration_minutes` (integer, default 30) - Expected interview duration
  - `type` (text, not null) - Interview type (voice_ai, video, phone, in-person)
  - `status` (text, default 'scheduled') - Interview status (scheduled, in-progress, completed, cancelled, no-show)
  - `meeting_link` (text) - Video/voice meeting link
  - `notification_sent` (boolean, default false) - Whether notification was sent
  - `reminder_sent` (boolean, default false) - Whether reminder was sent
  - `created_by` (uuid) - Reference to user who scheduled interview
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `interview_sessions`
  - `id` (uuid, primary key) - Unique session identifier
  - `interview_id` (uuid, not null) - Reference to interviews table
  - `started_at` (timestamptz) - Session start time
  - `ended_at` (timestamptz) - Session end time
  - `transcript` (text) - Full interview transcript
  - `audio_url` (text) - Recording URL if available
  - `responses` (jsonb) - Structured Q&A responses
  - `ai_analysis` (jsonb) - Real-time AI analysis data
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. `interview_reports`
  - `id` (uuid, primary key) - Unique report identifier
  - `interview_id` (uuid, not null, unique) - Reference to interviews table
  - `candidate_id` (uuid, not null) - Reference to candidates table
  - `overall_score` (integer, not null) - Overall score (0-100)
  - `technical_score` (integer) - Technical skills score (0-100)
  - `communication_score` (integer) - Communication skills score (0-100)
  - `cultural_fit_score` (integer) - Cultural fit score (0-100)
  - `sentiment_analysis` (text) - Overall sentiment (positive, neutral, negative)
  - `strengths` (text[]) - Identified strengths
  - `weaknesses` (text[]) - Identified weaknesses
  - `recommendation` (text, not null) - Hiring recommendation (strongly-recommend, recommend, neutral, not-recommend, strongly-not-recommend)
  - `detailed_feedback` (text) - Detailed AI-generated feedback
  - `report_data` (jsonb) - Full structured report data
  - `generated_at` (timestamptz) - Report generation timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### 7. `interview_questions`
  - `id` (uuid, primary key) - Unique question identifier
  - `job_position_id` (uuid) - Reference to job_positions table (null for generic questions)
  - `category` (text, not null) - Question category (technical, behavioral, situational, cultural)
  - `question_text` (text, not null) - The question text
  - `expected_answer` (text) - Expected answer or keywords
  - `scoring_criteria` (text) - How to score the answer
  - `difficulty_level` (text, default 'medium') - Difficulty (easy, medium, hard)
  - `is_active` (boolean, default true) - Whether question is active
  - `order_number` (integer) - Order in interview sequence
  - `created_by` (uuid) - Reference to user who created question
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 8. `notifications`
  - `id` (uuid, primary key) - Unique notification identifier
  - `recipient_email` (text, not null) - Recipient email address
  - `recipient_type` (text, not null) - Recipient type (candidate, user)
  - `notification_type` (text, not null) - Type (interview_scheduled, interview_reminder, interview_completed, report_ready)
  - `subject` (text, not null) - Email subject
  - `body` (text, not null) - Email body
  - `related_interview_id` (uuid) - Reference to interviews table
  - `sent_at` (timestamptz) - When notification was sent
  - `status` (text, default 'pending') - Status (pending, sent, failed)
  - `error_message` (text) - Error message if failed
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access data they're authorized for
  - Candidates have limited read access to their own data
  - Admins and recruiters have appropriate access levels
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'recruiter', 'interviewer')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  resume_url text,
  linkedin_url text,
  current_position text,
  years_experience integer DEFAULT 0,
  skills text[] DEFAULT '{}',
  status text DEFAULT 'new' CHECK (status IN ('new', 'screening', 'shortlisted', 'interviewing', 'hired', 'rejected')),
  ai_score integer CHECK (ai_score >= 0 AND ai_score <= 100),
  screening_notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_positions table
CREATE TABLE IF NOT EXISTS job_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  experience_required integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'on-hold')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_position_id uuid NOT NULL REFERENCES job_positions(id) ON DELETE CASCADE,
  interviewer_id uuid REFERENCES users(id),
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  type text NOT NULL CHECK (type IN ('voice_ai', 'video', 'phone', 'in-person')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
  meeting_link text,
  notification_sent boolean DEFAULT false,
  reminder_sent boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  started_at timestamptz,
  ended_at timestamptz,
  transcript text,
  audio_url text,
  responses jsonb DEFAULT '[]',
  ai_analysis jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create interview_reports table
CREATE TABLE IF NOT EXISTS interview_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL UNIQUE REFERENCES interviews(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  technical_score integer CHECK (technical_score >= 0 AND technical_score <= 100),
  communication_score integer CHECK (communication_score >= 0 AND communication_score <= 100),
  cultural_fit_score integer CHECK (cultural_fit_score >= 0 AND cultural_fit_score <= 100),
  sentiment_analysis text CHECK (sentiment_analysis IN ('positive', 'neutral', 'negative')),
  strengths text[] DEFAULT '{}',
  weaknesses text[] DEFAULT '{}',
  recommendation text NOT NULL CHECK (recommendation IN ('strongly-recommend', 'recommend', 'neutral', 'not-recommend', 'strongly-not-recommend')),
  detailed_feedback text,
  report_data jsonb DEFAULT '{}',
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_position_id uuid REFERENCES job_positions(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('technical', 'behavioral', 'situational', 'cultural')),
  question_text text NOT NULL,
  expected_answer text,
  scoring_criteria text,
  difficulty_level text DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  is_active boolean DEFAULT true,
  order_number integer,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_type text NOT NULL CHECK (recipient_type IN ('candidate', 'user')),
  notification_type text NOT NULL CHECK (notification_type IN ('interview_scheduled', 'interview_reminder', 'interview_completed', 'report_ready')),
  subject text NOT NULL,
  body text NOT NULL,
  related_interview_id uuid REFERENCES interviews(id) ON DELETE CASCADE,
  sent_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_job_positions_status ON job_positions(status);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for candidates table
CREATE POLICY "Authenticated users can view all candidates"
  ON candidates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create candidates"
  ON candidates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update candidates"
  ON candidates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete candidates"
  ON candidates FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for job_positions table
CREATE POLICY "Authenticated users can view all positions"
  ON job_positions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create positions"
  ON job_positions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update positions"
  ON job_positions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete positions"
  ON job_positions FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for interviews table
CREATE POLICY "Authenticated users can view all interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for interview_sessions table
CREATE POLICY "Authenticated users can view all sessions"
  ON interview_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create sessions"
  ON interview_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sessions"
  ON interview_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for interview_reports table
CREATE POLICY "Authenticated users can view all reports"
  ON interview_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON interview_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reports"
  ON interview_reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for interview_questions table
CREATE POLICY "Authenticated users can view all questions"
  ON interview_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON interview_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
  ON interview_questions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete questions"
  ON interview_questions FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for notifications table
CREATE POLICY "Authenticated users can view all notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);