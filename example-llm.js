const { init, processLog } = require('./src/index');
const config = require('./config/config.json');

async function main() {
    await init(config);

    await processLog({
        title: 'Server Battery Low',
        message: 'laptop2 battery is at 18%',
        severity: 0,
        trigger: 'battery-monitor'
    }, config, {
        hostname: 'laptop2',
        battery_threshold: 25,
        notes: 'critical server, needs immediate attention if battery drops below 25%'
    });

    await processLog({
        title: 'Database Query Slow',
        message: 'SELECT query took 3.2 seconds to execute',
        severity: 0,
        trigger: 'db-monitor'
    }, config, {
        query_time_ms: 3200,
        threshold_ms: 1000
    });

    await processLog({
        title: 'Disk Space Warning',
        message: '/dev/sda1 is at 95% capacity',
        severity: 0,
        trigger: 'disk-monitor'
    }, config);

    console.log('done processing test logs with ai analysis');
    process.exit(0);
}

main().catch(err => {
    console.error('error:', err);
    process.exit(1);
});