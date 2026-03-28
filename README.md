# RPT Card

Daily habit/health tracker. Spreadsheet-style grid — activities down the left, dates across the top. Mobile-first. Hosted on Cloudflare Pages with D1 (SQLite at the edge) for persistence.

## First-time setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the D1 database

```bash
npx wrangler d1 create rpt-card-db
```

Copy the `database_id` from the output and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "rpt-card-db"
database_id = "PASTE_YOUR_ID_HERE"
```

### 3. Run the schema migration

Local:
```bash
npm run db:migrate
```

Remote (production):
```bash
npm run db:migrate:remote
```

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:8788 in your browser.

> Note: `wrangler pages dev` runs the Functions (D1 bindings) alongside the static files. Make sure wrangler is authenticated (`npx wrangler login`) before running.

---

## Deploy to Cloudflare Pages

### Option A — Git-connected deploy (recommended)

1. Push this repo to GitHub.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your repo. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `public`
4. Under **Settings → Functions → D1 database bindings**, add:
   - Variable name: `DB`
   - D1 database: `rpt-card-db`
5. Deploy. Every push to `main` auto-deploys.

### Option B — Direct deploy

```bash
npm run deploy
```

Then add the D1 binding in the Cloudflare Dashboard under your Pages project settings.

---

## Project structure

```
rpt-card/
  public/
    index.html          # Full frontend (single file, inline JS/CSS)
  functions/
    api/
      entries.js        # GET + PUT /api/entries
      activities.js     # GET /api/activities
  schema.sql            # D1 migration
  wrangler.toml         # Cloudflare config
  package.json
  README.md
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/entries?from=YYYY-MM-DD&to=YYYY-MM-DD` | Fetch entries in range |
| PUT | `/api/entries` | Upsert `{ activity, date, value }` — pass `value: null` to clear |
| GET | `/api/activities` | List activities |
