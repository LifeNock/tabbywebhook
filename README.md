# tabby-webhook

Smart webhook relay system that actually stores your logs instead of just throwing them into Discord.

## What It Does

Services send massive error logs → we store them → format them nicely → send to Discord.

Handles the annoying parts like message size limits, severity-based routing, and keeping full logs accessible when Discord's 2000 character limit isn't enough.

## Features

- **Bitmask severity system** - Fine control over what gets sent and whether it pings.
- **Full log storage** - Discord shows a summary, full content stays in the database.
- **Smart formatting** - Automatically truncates and embeds logs for readability.
- **Trigger tracking** - Know exactly what caused each log entry.
- **Future-ready** - Built to add AI summarization later.

## Severity System

Each log has a severity value (0-255) that controls routing:

```
255 (bit 1 + 8): Send to Discord with @here ping
128 (bit 8):     Send to Discord without ping
0:               Store only, don't send
```

Basically, if the severity bitmask has bit 1 set it pings, if bit 8 is set it sends without ping, if neither are set it just stores.

## Schema

```sql
log_entries
├── id (serial)
├── title (varchar)
├── message (text)
├── severity (smallint 0-255)
├── trigger (varchar)
├── created_at (timestamp)
├── sent_to_discord (boolean)
└── discord_pinged (boolean)
```

## API Usage

### Initialization

```javascript
const { init, processLog } = require('tabby-webhook');
const config = require('./config/config.json');

await init(config);
```

### Logging an Entry

```javascript
await processLog({
    title: 'Error in payment processor',
    message: 'Full error stack trace here...',
    severity: 255,  // will send to discord with ping
    trigger: 'payment-service'
}, config);
```

### Severity Examples

```javascript
// critical error, ping everyone
severity: 255

// warning, send but don't ping
severity: 128

// info, just store it
severity: 0

// custom combinations (any bits work)
severity: 129  // sends with ping (bit 1 + bit 8)
```

## Roadmap

- [x] Base log storage system
- [x] Discord webhook integration
- [x] Severity bitmask routing
- [ ] HTTP API for log submission
- [ ] Web UI for viewing stored logs
- [ ] AI summarization for massive logs
- [ ] Multi-destination routing (Slack, email, etc)

## Tech Stack

- Node.js
- PostgreSQL
- Discord webhooks

## License

Apache 2.0 - see LICENSE file