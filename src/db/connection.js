const { Pool } = require('pg');

let pool;

function initDb(config) {
    if (pool) {
        return pool;
    }

    pool = new Pool({
        host: config.host || 'localhost',
        port: config.port || 5432,
        database: config.database,
        user: config.user,
        password: config.password,
        max: config.maxConnections || 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
        console.error('unexpected db error', err);
    });

    return pool;
}

function getDb() {
    if (!pool) {
        throw new Error('db not initialized, call initDb first');
    }
    return pool;
}

async function closeDb() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

module.exports = {
    initDb,
    getDb,
    closeDb
};