# NexaFlow Portfolio Tracker

Portfolio Tracker is a Next.js 14 and Firebase application for tracking investment portfolios across multiple brokers, importing broker CSV exports, and comparing portfolio growth against benchmark indices.

## Stack

- Next.js 14 App Router
- Tailwind CSS
- Firebase Auth and Firestore
- Firebase Admin for protected API routes
- Recharts for portfolio and benchmark charts
- PapaParse for broker CSV imports

## Included Pages

- Public marketing pages: `/`, `/features`, `/pricing`
- Auth: `/login`, `/signup`
- Dashboard: `/home`, `/holdings`, `/performance`, `/activities`, `/brokers`, `/reports`, `/settings`, `/admin`
- Reporting sub-pages for trades, taxable income, sold securities, and performance summaries

## Setup

1. Copy [`.env.local.example`](./.env.local.example) to `.env.local`.
2. Fill in your Firebase client credentials, Firebase Admin service account details, and optional Alpha Vantage key.
3. Enable Email/Password and Google sign-in providers in Firebase Auth.
4. Create a Firestore database and configure the security rules from the spec.
5. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## CSV Samples

Sample broker CSV files are available in [`public/samples`](./public/samples):

- `hsbc.csv`
- `180-markets.csv`
- `708-wealth.csv`
- `alpine-capital.csv`
- `asr-wealth.csv`
- `sharesight.csv`

## Build Verification

Production build verification was completed with:

```bash
npm run build
```

If the Firebase Admin private key in `.env.local` is malformed, the build still succeeds because the admin bootstrap now falls back gracefully during compilation. Runtime Firebase Admin features still require valid credentials.

## Demo Seeding

To seed dashboard data for an existing Firebase Auth user:

```bash
npm run seed:demo-user -- one@test.com
```

Shortcut for the default demo account:

```bash
npm run seed:one
```

The seed is idempotent for demo-created docs. Re-running it deletes prior demo activities, demo brokers, and demo snapshots for that user and recreates them.
