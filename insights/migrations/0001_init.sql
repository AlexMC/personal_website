-- Daily site-wide totals per search engine. Kept separately from search_rows
-- because Google omits anonymised (rare) queries from per-query data, so
-- summing rows under-counts.
CREATE TABLE search_totals (
  source      TEXT    NOT NULL,          -- 'google' | 'bing'
  date        TEXT    NOT NULL,          -- YYYY-MM-DD
  clicks      INTEGER NOT NULL,
  impressions INTEGER NOT NULL,
  position    REAL,                      -- average position; NULL when the source does not report it
  PRIMARY KEY (source, date)
);

-- Per query (and page, for Google). Bing reports weekly buckets: date is the bucket date.
CREATE TABLE search_rows (
  source      TEXT    NOT NULL,
  date        TEXT    NOT NULL,
  query       TEXT    NOT NULL,
  page        TEXT    NOT NULL,          -- '' when the source does not report pages
  clicks      INTEGER NOT NULL,
  impressions INTEGER NOT NULL,
  position    REAL,
  PRIMARY KEY (source, date, query, page)
);
CREATE INDEX search_rows_by_date ON search_rows (source, date);

CREATE TABLE ai_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at  TEXT NOT NULL,
  finished_at TEXT,
  trigger     TEXT NOT NULL              -- 'cron' | 'manual'
);

CREATE TABLE ai_answers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id      INTEGER NOT NULL REFERENCES ai_runs (id),
  engine      TEXT    NOT NULL,
  model       TEXT,
  prompt_id   TEXT    NOT NULL,
  prompt      TEXT    NOT NULL,
  answer      TEXT,
  sources     TEXT    NOT NULL DEFAULT '[]',   -- JSON array of URLs
  identity    TEXT,                            -- 'correct' | 'wrong_person' | 'not_mentioned' | 'unverified'
  issues      TEXT    NOT NULL DEFAULT '[]',   -- JSON array of {claim, problem}
  cites_own   INTEGER NOT NULL DEFAULT 0,      -- 1 when a source is on alexcarvalho.me
  error       TEXT,
  created_at  TEXT    NOT NULL
);
CREATE INDEX ai_answers_by_run ON ai_answers (run_id);

CREATE TABLE job_log (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  at     TEXT    NOT NULL,
  job    TEXT    NOT NULL,                 -- 'google' | 'bing' | 'ai'
  ok     INTEGER NOT NULL,
  detail TEXT
);
