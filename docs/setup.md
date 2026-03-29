# 🚀 Project Setup Guide

**Distributed Event & Activity Tracking Platform**

This guide will help you **run the entire system locally** from scratch.

---

# 📦 1. Prerequisites

Make sure the following are installed:

### ✅ Required

* Node.js (v18+)
* npm (v8+)
* Docker & Docker Compose

### ✅ Verify Installation

```bash
node -v
npm -v
docker -v
docker-compose -v
```

---

# 🧱 2. Project Structure

```
/event-platform
 ├── ingestion-service
 ├── processor-service
 ├── docker-compose.yml
 └── docs/
```

---

# 🐳 3. Start Infrastructure (Redis + PostgreSQL + OpenSearch)

Run:

```bash
docker-compose up -d
```

This will start:

| Service    | Port |
| ---------- | ---- |
| Redis      | 6379 |
| PostgreSQL | 5434 |
| OpenSearch | 9200 |

---

# 🔍 4. Verify Services

### Redis

```bash
docker exec -it injestion-system-redis-1 redis-cli
PING
```

Expected:

```
PONG
```

---

### PostgreSQL

```bash
psql -h localhost -p 5434 -U postgres
```

---

### OpenSearch

Open in browser:

```
http://localhost:9200
```

---

# 📦 5. Install Dependencies

### Ingestion Service

```bash
cd ingestion-service
npm install
```

### Processor Service

```bash
cd ../processor-service
npm install
```

---

# 🟢 6. Start Services

### Start Ingestion Service

```bash
cd ingestion-service
npm run start:dev
```

Runs on:

```
http://localhost:3000
```

---

### Start Processor Service

```bash
cd ../processor-service
npm run start:dev
```

Runs on:

```
http://localhost:3001
```

---

# 📡 7. Test Event Ingestion

### Endpoint

```
POST http://localhost:3000/api/v1/events
```

### Headers

```
x-api-key: test-api-key
```

### Body

```json
{
  "eventType": "USER_LOGIN",
  "timestamp": "2026-03-08T10:00:00Z",
  "userId": "user123",
  "metadata": {
    "device": "mobile"
  }
}
```

---

# 🔄 8. Verify Processing

### Check PostgreSQL

Table:

```
events_metadata
```

---

### Check OpenSearch

```
http://localhost:9200/events-*/_search?pretty
```

---

# 🔍 9. Debug & Monitoring Commands

### Check Redis Stream

```bash
XRANGE events:ingestion - +
```

### Check DLQ

```bash
XRANGE events:dlq - +
```

### Check Consumer Groups

```bash
XINFO GROUPS events:ingestion
```

### Check Pending Messages

```bash
XPENDING events:ingestion event-processors
```

---

# 🧪 10. Test Retry & DLQ

1. Add error in processor service:

```ts
throw new Error("Simulated failure");
```

2. Observe:

* Retry attempts
* Event moves to DLQ after max retries

---

# 🛑 11. Stop Services

```bash
docker-compose down
```

---

# 🔁 12. Reset System (Clean State)

```bash
redis-cli
DEL events:ingestion
DEL events:dlq
```

Optional:

```bash
XGROUP DESTROY events:ingestion event-processors
```

---

# ⚡ Quick Start (TL;DR)

```bash
docker-compose up -d

cd ingestion-service
npm install && npm run start:dev

cd ../processor-service
npm install && npm run start:dev
```

---

# 🧠 Notes

* Processor service runs as a background worker
* OpenSearch may take ~30–60 seconds to fully start
* Ensure Docker has at least **2–4GB RAM allocated**

---

# 🎯 You’re Ready

Once running, the system supports:

* High-throughput event ingestion
* Async processing via Redis Streams
* Retry + DLQ handling
* PostgreSQL persistence
* OpenSearch indexing

---
