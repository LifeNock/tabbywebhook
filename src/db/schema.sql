CREATE TABLE IF NOT EXISTS log_entries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity SMALLINT NOT NULL CHECK (severity >= 0 AND severity <= 255),
    trigger VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    sent_to_discord BOOLEAN DEFAULT false,
    discord_pinged BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_severity ON log_entries(severity);
CREATE INDEX IF NOT EXISTS idx_created_at ON log_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_trigger ON log_entries(trigger);
CREATE INDEX IF NOT EXISTS idx_sent_to_discord ON log_entries(sent_to_discord);