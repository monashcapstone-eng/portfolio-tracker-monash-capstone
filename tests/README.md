QA smoke scripts are now wired into the package scripts.

Available commands:

- `npm run qa:public`
- `npm run qa:api`
- `npm run qa`

Default target:

- `QA_BASE_URL=http://localhost:3000`

Optional environment variables for authenticated API checks:

- `QA_TEST_EMAIL`
- `QA_TEST_PASSWORD`
- `NEXT_PUBLIC_FIREBASE_API_KEY`

Examples:

```bash
npm run dev
npm run qa
```

```bash
QA_BASE_URL=https://your-vercel-domain.vercel.app npm run qa:public
```

```bash
QA_BASE_URL=https://your-vercel-domain.vercel.app \
QA_TEST_EMAIL=one@test.com \
QA_TEST_PASSWORD=your_password \
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key \
npm run qa:api
```

What the scripts cover:

- Public page availability and key content checks
- Anonymous API rejection checks
- Benchmark endpoint smoke check
- Optional authenticated API checks for activities, brokers, holdings, settings, snapshots, and session verification
