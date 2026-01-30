function getSeverityColor(severity) {
    if (severity >= 200) return 0xDC143C;
    if (severity >= 128) return 0xFF8C00;
    if (severity >= 64) return 0xFFD700;
    return 0x808080;
}

function truncateMessage(message, maxLength = 4096) {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength - 3) + '...';
}

async function sendToDiscord(webhookUrl, entry, shouldPing, logPageUrl = null) {
    const embed = {
        title: entry.title,
        description: truncateMessage(entry.message, 300),
        color: getSeverityColor(entry.severity),
        fields: [
            { name: 'Severity', value: entry.severity.toString(), inline: true },
            { name: 'Trigger', value: entry.trigger || 'N/A', inline: true },
            { name: 'Time', value: new Date(entry.created_at).toISOString(), inline: true }
        ],
        footer: { 
            text: `Log ID: ${entry.id} • TabbyCluster`,
            icon_url: 'https://lifenock.github.io/tabbywebhook/public/assets/tabbycluster.png'
        },
        thumbnail: {
            url: 'https://lifenock.github.io/tabbywebhook/public/assets/tabbycluster.png'
        },
        timestamp: new Date(entry.created_at).toISOString()
    };

    if (logPageUrl) {
        embed.fields.push({
            name: '📋 Full Details',
            value: `[View complete analysis and log](${logPageUrl})`,
            inline: false
        });
    }

    const payload = {
        content: shouldPing ? '@here' : '',
        embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`discord webhook failed: ${response.status}`);
    }

    return true;
}

module.exports = {
    sendToDiscord,
    getSeverityColor,
    truncateMessage
};