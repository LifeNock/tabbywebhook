const fs = require('fs').promises;
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, '../../public/logs/template.html');
const LOGS_DIR = path.join(__dirname, '../../public/logs');

function getSeverityClass(severity) {
    if (severity >= 200) return 'critical';
    if (severity >= 128) return 'warning';
    return 'info';
}

function getDiscordStatus(sentToDiscord, pinged) {
    if (!sentToDiscord) return 'Not sent';
    return pinged ? 'Sent with @here ping' : 'Sent without ping';
}

async function generateLogPage(entry, aiAnalysis = null) {
    const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');
    
    const aiSection = aiAnalysis ? `
        <div class="ai-analysis">
            <h2>AI Analysis</h2>
            <p>${aiAnalysis.summary}</p>
            <div class="recommendation">
                <h3>Recommended Action</h3>
                <p>${aiAnalysis.recommended_action}</p>
            </div>
        </div>
    ` : '';
    
    const html = template
        .replace(/{{TITLE}}/g, entry.title)
        .replace(/{{SEVERITY}}/g, entry.severity)
        .replace(/{{SEVERITY_CLASS}}/g, getSeverityClass(entry.severity))
        .replace(/{{LOG_ID}}/g, entry.id)
        .replace(/{{TRIGGER}}/g, entry.trigger || 'N/A')
        .replace(/{{TIMESTAMP}}/g, new Date(entry.created_at).toLocaleString())
        .replace(/{{DISCORD_STATUS}}/g, getDiscordStatus(entry.sent_to_discord, entry.discord_pinged))
        .replace(/{{MESSAGE}}/g, entry.message)
        .replace(/{{AI_ANALYSIS_SECTION}}/g, aiSection);
    
    const filename = `${entry.id}.html`;
    const filepath = path.join(LOGS_DIR, filename);
    
    await fs.writeFile(filepath, html, 'utf-8');
    
    return filename;
}

function getLogPageUrl(logId, baseUrl = 'https://lifenock.github.io/tabbywebhook') {
    return `${baseUrl}/public/logs/${logId}.html`;
}

module.exports = {
    generateLogPage,
    getLogPageUrl
};