# tabby-webhook

smart webhook relay system that actually stores your logs instead of just yeeting them into discord

## what it does

services send massive error logs → we store them → format them nicely → send to discord

handles the annoying parts like message size limits, severity-based routing, and keeping full logs accessible when discord's 2000 char limit isn't enough

## features

- **bitmask severity system** - fine control over what gets sent and whether it pings
- **full log storage** - discord shows a summary, full content stays in the database
- **smart formatting** - automatically truncates and embeds logs for readability
- **trigger tracking** - know exactly what caused each log entry
- **future-ready** - built to add AI summarization later

## severity system

each log has a severity value (0-255) that controls routing:

```
255 (bit 1 + 8): send to discord with @here ping
128 (bit 8):     send to discord without ping
0:               store only, don't send
```

basically if the severity bitmask has bit 1 set it pings, if bit 8 is set it sends without ping, if neither are set it just stores

## schema

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

## roadmap

- [ ] base log storage system
- [ ] discord webhook integration
- [ ] severity bitmask routing
- [ ] http api for log submission
- [ ] web ui for viewing stored logs
- [ ] AI summarization for massive logs
- [ ] multi-destination routing (slack, email, etc)

## tech stack

- node.js
- postgresql
- discord webhooks

## license

apache 2.0 - see LICENSE file
