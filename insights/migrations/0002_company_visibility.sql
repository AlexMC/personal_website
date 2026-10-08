-- Visibility plan (2026-10): track whether answers name Abstract Extraordinary
-- and cite its site, alongside the existing person-level checks.
-- NULL = graded before this migration.
ALTER TABLE ai_answers ADD COLUMN company_named INTEGER;
ALTER TABLE ai_answers ADD COLUMN cites_company INTEGER NOT NULL DEFAULT 0;
