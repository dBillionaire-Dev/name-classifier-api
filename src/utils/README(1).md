# Genderize Classify API

Stage 0 Backend Assessment — Name gender classification endpoint built with **Node.js**, **Express**, and **TypeScript**.

## What It Does

Exposes a single GET endpoint that accepts a `name` query parameter, calls the [Genderize API](https://genderize.io/), processes the raw response, and returns a structured result.

## Tech Stack

- Node.js
- Express
- TypeScript

---

## Getting Started

### 1. Generate `package.json`

If you're starting from scratch (no `package.json` yet), initialise the project first:

```bash
npm init -y
```

This creates a default `package.json`. Then replace its contents with the following so the scripts, name, and metadata are correctly set:

```json
{
  "name": "genderize-api",
  "version": "1.0.0",
  "description": "Stage 0 Backend — Name classification API using Genderize",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.5",
    "nodemon": "^3.0.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

---

### 2. Install dependencies

Install all production and development dependencies in one command:

```bash
npm install
```

This installs everything listed under both `dependencies` and `devDependencies` in `package.json`:

| Package | Type | Purpose |
|---|---|---|
| `express` | dependency | Web framework for building the API |
| `@types/express` | devDependency | TypeScript type definitions for Express |
| `@types/node` | devDependency | TypeScript type definitions for Node.js built-ins |
| `nodemon` | devDependency | Watches for file changes and auto-restarts the server in dev |
| `ts-node` | devDependency | Executes TypeScript directly without a separate compile step |
| `typescript` | devDependency | The TypeScript compiler (`tsc`) |

> **Note:** `devDependencies` are only used during development and building. When you deploy, platforms like Vercel and Railway install only `dependencies` for the production runtime.

---

### 3. TypeScript configuration

Create a `tsconfig.json` file in the root of your project with the following content:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

What each key does:

- **`target: ES2020`** — compiles your TypeScript down to ES2020 JavaScript, which Node.js 14+ fully supports
- **`module: commonjs`** — outputs `require()`-style modules, which is what Node.js uses by default
- **`outDir: ./dist`** — compiled `.js` files go into the `dist/` folder
- **`rootDir: ./src`** — tells the compiler your source files live in `src/`
- **`strict: true`** — enables all strict type checks, catching more bugs at compile time
- **`esModuleInterop: true`** — allows you to use `import express from "express"` instead of `import * as express from "express"`
- **`skipLibCheck: true`** — skips type checking of declaration files in `node_modules`, speeding up compilation
- **`resolveJsonModule: true`** — allows importing `.json` files directly in TypeScript

---

### 4. Run locally (development)

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### 5. Build for production

```bash
npm run build
npm start
```

---

## Endpoint

### `GET /api/classify?name={name}`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-10T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Scenario | Status | Message |
|---|---|---|
| Missing `name` param | 400 | `Missing required query parameter: name` |
| `name` is not a string | 422 | `Query parameter 'name' must be a string` |
| No Genderize prediction | 200 | `No prediction available for the provided name` |
| Upstream API failure | 502 | `Upstream API error: ...` |
| Server error | 500 | `Internal server error: ...` |

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
