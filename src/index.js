const { initDb } = require('./db/connection');
const { createLogEntry, markAsSent } = require('./services/logger');
const { sendToDiscord } = require('./services/discord');
const { shouldSendToDiscord, shouldPing } = require('./utils/severity');

async function processLog({ title, message, severity, trigger }, config) {
    const entry = await createLogEntry({ title, message, severity, trigger });
    
    if (shouldSendToDiscord(severity)) {
        const ping = shouldPing(severity);
        
        try {
            await sendToDiscord(config.discord.webhookUrl, entry, ping);
            await markAsSent(entry.id, ping);
            console.log(`sent log ${entry.id} to discord (ping: ${ping})`);
        } catch (error) {
            console.error(`failed to send log ${entry.id} to discord:`, error.message);
        }
    } else {
        console.log(`stored log ${entry.id} without sending to discord`);
    }
    
    return entry;
}

async function init(config) {
    initDb(config.database);
    console.log('database initialized');
}

module.exports = {
    init,
    processLog
};