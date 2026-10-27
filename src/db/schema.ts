export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  latitude REAL,
  longitude REAL,
  contact_person TEXT,
  contact_phone TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  hospital_id TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  check_in_time TEXT,
  check_out_time TEXT,
  latitude REAL,
  longitude REAL,
  notes TEXT,
  photo_urls TEXT, -- JSON array
  signature_url TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK(sync_status IN ('draft', 'pending', 'synced', 'failed')),
  last_modified_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE IF NOT EXISTS outbox (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('check_in', 'upload_photo', 'submit_form', 'check_out')),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL CHECK(method IN ('POST', 'PUT', 'PATCH')),
  payload TEXT NOT NULL, -- JSON payload
  depends_on TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_attempt_at TEXT NOT NULL,
  last_error TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'syncing', 'synced', 'failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visits_scheduled ON visits(scheduled_date, status);
CREATE INDEX IF NOT EXISTS idx_outbox_queue ON outbox(status, next_attempt_at);
`;
