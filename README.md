# 🚀 Distributed Event & Activity Tracking Platform

A **distributed, backend-heavy event ingestion and analytics platform** designed to handle **high-throughput event processing**, provide **real-time search and aggregation**, and ensure **fault-tolerant, scalable data pipelines**.

---

## 📌 Overview

This system ingests events from multiple clients, processes them asynchronously using **Redis Streams**, and stores them for **analytics and search** using **PostgreSQL and OpenSearch**.

It is designed with **production-grade backend principles** including:

* Asynchronous processing
* Idempotency
* Retry & Dead Letter Queue (DLQ)
* Bulk indexing
* Observability & monitoring

---

## 🧱 Architecture

```
Client Applications
        ↓
Ingestion Service (NestJS)
(Auth + Validation + Rate Limiting)
        ↓
Redis Streams (events:ingestion)
        ↓
Processor Service (Consumer Group)
        ↓
+ PostgreSQL (event metadata)
+ OpenSearch (search & analytics)
        ↓
Monitoring & Metrics
```

---

## ⚙️ Tech Stack

### Backend

* NestJS (TypeScript)
* Node.js

### Messaging

* Redis Streams (Consumer Groups)

### Databases

* PostgreSQL (metadata storage)
* OpenSearch (search & analytics)

### Infrastructure

* Docker & Docker Compose

### Observability

* Structured logging (Pino)
* Correlation IDs
* Metrics & health checks

---

## 🔥 Key Features

### 1️⃣ High-Throughput Event Ingestion

* REST APIs with **DTO validation**
* **API key authentication**
* **Per-source rate limiting**

---

### 2️⃣ Asynchronous Processing Pipeline

* Redis Streams for decoupling ingestion & processing
* Consumer groups for horizontal scalability
* Batch-based event consumption

---

### 3️⃣ Reliability & Fault Tolerance

* Retry mechanism with retry count tracking
* Dead Letter Queue (DLQ) for failed events
* Idempotent processing to avoid duplicates

---

### 4️⃣ Scalable Storage Strategy

* PostgreSQL for structured metadata
* OpenSearch for:

  * Full-text search
  * Aggregations
  * Time-series queries

---

### 5️⃣ Bulk Indexing (High Performance)

* Batch processing of events
* OpenSearch bulk API for efficient indexing
* 10x–100x throughput improvement

---

### 6️⃣ Observability & Monitoring

* Structured JSON logging
* Correlation ID propagation
* Queue lag monitoring
* Health endpoints

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

* Node.js (v18+)
* Docker

---

### 2️⃣ Start Infrastructure

```bash
docker-compose up
```

---

### 3️⃣ Start Services

#### Ingestion Service

```bash
cd ingestion-service
npm install
npm run start:dev
```

#### Processor Service

```bash
cd processor-service
npm install
npm run start:dev
```

---

## 📡 API Usage

### Ingest Event

**POST** `/api/v1/events`

#### Headers

```
x-api-key: test-api-key
```

#### Body

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

#### Response

```json
{
  "status": "accepted",
  "eventId": "uuid"
}
```

---

## 🔍 Verify Data

### PostgreSQL

Check `events_metadata` table.

### OpenSearch

```
GET http://localhost:9200/events-*/_search?pretty
```

---

## 🧪 Testing Failure Handling

To simulate failures:

* Throw an error in processor service
* Observe:

  * Retry attempts
  * Event moved to DLQ

---

## 📊 System Capabilities

* Handles **high-throughput ingestion**
* Supports **horizontal scaling**
* Ensures **eventual consistency**
* Provides **real-time analytics readiness**

---

## 🧠 Key Design Decisions

| Decision      | Reason                         |
| ------------- | ------------------------------ |
| Redis Streams | Async processing & scalability |
| Bulk indexing | High throughput                |
| OpenSearch    | Fast search & aggregation      |
| Idempotency   | Prevent duplicate processing   |
| DLQ           | Fault isolation                |

---

## 📈 Future Enhancements

* Analytics APIs (aggregations, trends)
* Dashboard UI
* Prometheus + Grafana integration
* Kubernetes deployment
* Kafka support for ultra-high throughput

---

## 👨‍💻 Author

**Anish Rachcha**
Software Engineer (Backend / Distributed Systems)

---

## ⭐ Why This Project Matters

This project demonstrates:

* Distributed system design
* Backend architecture at scale
* Reliability engineering (retry, DLQ)
* High-performance data pipelines

---

## 🏁 Summary

A **production-grade event ingestion platform** built with modern backend technologies, showcasing scalable system design and real-world engineering practices.
