const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
let model;

function initLLM(apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash'
    });
}

async function analyzeLog(logEntry, context = {}) {
    if (!model) {
        throw new Error('llm not initialized');
    }

    const prompt = `You are a log analysis system. Analyze this log entry and provide a JSON response.

Log Entry:
Title: ${logEntry.title}
Message: ${logEntry.message}
Trigger: ${logEntry.trigger || 'unknown'}
Timestamp: ${logEntry.created_at}

Context: ${JSON.stringify(context)}

Respond ONLY with valid JSON in this exact format:
{
  "severity": <number 0-255>,
  "should_alert": <boolean>,
  "summary": "<brief summary>",
  "recommended_action": "<what to do>"
}

Severity guide:
- 255: Critical, ping immediately
- 128: Warning, send without ping  
- 0: Info only, just store

Do not include any text before or after the JSON.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('llm did not return valid json');
    }

    return JSON.parse(jsonMatch[0]);
}

module.exports = {
    initLLM,
    analyzeLog
};