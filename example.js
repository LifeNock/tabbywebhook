const { init, processLog } = require('./src/index');
const config = require('./config/config.json');

async function main() {
    await init(config);

    await processLog({
        title: 'Test Error',
        message: 'this is a test error message that would normally be huge but this is just a demo',
        severity: 255,
        trigger: 'manual-test'
    }, config);

    await processLog({
        title: 'Silent Log',
        message: 'this one just gets stored, no discord notification',
        severity: 0,
        trigger: 'background-process'
    }, config);

    await processLog({
        title: 'Warning Without Ping',
        message: 'something happened but not urgent enough to ping everyone',
        severity: 128,
        trigger: 'rate-limiter'
    }, config);

    console.log('done processing test logs');
    process.exit(0);
}

main().catch(err => {
    console.error('error:', err);
    process.exit(1);
});