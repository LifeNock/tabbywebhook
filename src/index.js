const { initDb } = require('./db/connection');
const { createLogEntry, markAsSent } = require('./services/logger');
const { sendToDiscord } = require('./services/discord');
const { shouldSendToDiscord, shouldPing } = require('./utils/severity');
const { initLLM, analyzeLog } = require('./services/llm');

async function processLog({ title, message, severity, trigger }, config, context = {}) {
    let finalSeverity = severity;
    let aiAnalysis = null;

    if (config.llm?.enabled && config.llm?.apiKey) {
        try {
            const tempEntry = { title, message, trigger, created_at: new Date() };
            aiAnalysis = await analyzeLog(tempEntry, context);
            finalSeverity = aiAnalysis.severity;
            console.log('ai analysis:', aiAnalysis);
        } catch (error) {
            console.error('llm analysis failed, using original severity:', error.message);
        }
    }

    const entry = await createLogEntry({ title, message, severity: finalSeverity, trigger });
    
    if (shouldSendToDiscord(finalSeverity)) {
        const ping = shouldPing(finalSeverity);
        
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
    
    return { entry, aiAnalysis };
}

async function init(config) {
    initDb(config.database);
    
    if (config.llm?.enabled && config.llm?.apiKey) {
        initLLM(config.llm.apiKey);
        console.log('llm initialized');
    }
    
    console.log('database initialized');
}

module.exports = {
    init,
    processLog
};