const { getDb } = require('../db/connection');
const { validateSeverity } = require('../utils/severity');

async function createLogEntry({ title, message, severity, trigger }) {
    validateSeverity(severity);

    if (!title || !message) {
        throw new Error('title and message are required');
    }

    const db = getDb();
    
    const result = await db.query(
        `INSERT INTO log_entries (title, message, severity, trigger)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, message, severity, trigger || null]
    );

    return result.rows[0];
}

async function getLogEntry(id) {
    const db = getDb();
    const result = await db.query(
        'SELECT * FROM log_entries WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
}

async function markAsSent(id, pinged) {
    const db = getDb();
    await db.query(
        `UPDATE log_entries 
         SET sent_to_discord = true, discord_pinged = $2
         WHERE id = $1`,
        [id, pinged]
    );
}

async function getRecentLogs(limit = 50) {
    const db = getDb();
    const result = await db.query(
        'SELECT * FROM log_entries ORDER BY created_at DESC LIMIT $1',
        [limit]
    );
    return result.rows;
}

module.exports = {
    createLogEntry,
    getLogEntry,
    markAsSent,
    getRecentLogs
};