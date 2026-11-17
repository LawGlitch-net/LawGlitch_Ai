-- ============================================================
-- LawGlitch — Contact Form Supabase Schema
-- Table: contact_submissions
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Create the table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  company       TEXT NOT NULL,
  role          TEXT NOT NULL,
  use_case      TEXT NOT NULL,
  consented_at  TIMESTAMPTZ NOT NULL
);

-- Index for faster lookup by email
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
  ON public.contact_submissions (email);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: anyone (anon) can INSERT (submit the form)
CREATE POLICY "Allow anon inserts"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: only authenticated users (service role / dashboard) can SELECT
CREATE POLICY "Only authenticated can read"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: no one can UPDATE or DELETE via API (admin only via dashboard)
-- (No UPDATE or DELETE policies = those are blocked by default when RLS is enabled)

-- ============================================================
-- Optional: Grant usage for anon inserts
-- ============================================================
GRANT INSERT ON public.contact_submissions TO anon;
GRANT USAGE ON SEQUENCE public.contact_submissions_id_seq TO anon;
