const SEND_WITH_PING = 1;
const SEND_NO_PING = 128;

function shouldSendToDiscord(severity) {
    return (severity & SEND_WITH_PING) !== 0 || (severity & SEND_NO_PING) !== 0;
}

function shouldPing(severity) {
    return (severity & SEND_WITH_PING) !== 0;
}

function validateSeverity(severity) {
    if (typeof severity !== 'number' || severity < 0 || severity > 255) {
        throw new Error('severity must be between 0 and 255');
    }
    return true;
}

module.exports = {
    shouldSendToDiscord,
    shouldPing,
    validateSeverity,
    SEND_WITH_PING,
    SEND_NO_PING
};