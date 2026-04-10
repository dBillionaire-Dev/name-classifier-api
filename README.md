# Genderize Classify API

HNG Backend Stage 0 Task — Name gender classification endpoint built with **Node.js**, **Express**, and **TypeScript**.

## Overview

This is a REST API that classifies a given name by gender using the Genderize API.
It processes the raw API response, adds business logic (confidence scoring), and returns a structured response.

## What It Does

Exposes a single GET endpoint that accepts a `name` query parameter, calls the [Genderize API](https://genderize.io/), processes the raw response, and returns a structured result.

## Features
- Accepts a name via query parameter
- Integrates with external Genderize API
- Renames count → sample_size
- Computes confidence score (is_confident)
- Generates dynamic timestamp (processed_at)
- Handles input validation and edge cases
- Proper error handling with meaningful status codes
- CORS enabled for public access

## Tech Stack

- Node.js
- Express
- TypeScript

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally (development)

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### 3. Build for production

```bash
npm run build
npm start
```

---

## Endpoint

### `GET /api/classify?name={name}`

Taking:
### `GET /api/classify?name=nezer`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "name": "nezer",
    "gender": "male",
    "probability": 0.93,
    "sample_size": 101,
    "is_confident": true,
    "processed_at": "2026-04-10T14:40:25.167Z"
  }
}
```

**Error Responses:**

| Scenario                | Status | Message                                         |
|-------------------------|--------|-------------------------------------------------|
| Success                 | 200    | `JSON containing the processed data`            |
| Missing `name` param    | 400    | `Missing required query parameter: name`        |
| `name` is not a string  | 422    | `Query parameter 'name' must be a string`       |
| No Genderize prediction | 422    | `No prediction available for the provided name` |
| Upstream API failure    | 502    | `Upstream API error: ...`                       |
| Server error            | 500    | `Internal server error: ...`                    |

All errors follow:
```json
{ "status": "error", "message": "..." }
```

---

## Processing Rules

- `count` from Genderize is renamed to `sample_size`
- `is_confident` is `true` only when `probability >= 0.7` AND `sample_size >= 100`
- `processed_at` is the UTC ISO 8601 timestamp generated on every request

---

## Deployment

This project is configured for **Vercel** deployment via `vercel.json`.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or deploy to **Railway** / **Heroku** using the build + start scripts in `package.json`.
