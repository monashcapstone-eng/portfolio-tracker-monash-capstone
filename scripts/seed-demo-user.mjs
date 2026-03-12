import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");

function loadEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function ensureAdmin() {
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing .env.local. Create it before running the seeder.");
  }

  loadEnvFile(envPath);

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

function isoDateMonthsAgo(monthsAgo, day = 12) {
  const date = new Date();
  date.setUTCDate(day);
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCMonth(date.getUTCMonth() - monthsAgo);
  return date.toISOString().split("T")[0];
}

function buildDemoActivities({ brokers, securities }) {
  const broker = (key) => brokers[key];
  const security = (key) => securities[key];

  return [
    {
      key: "bhp-buy-1",
      type: "BUY",
      date: isoDateMonthsAgo(14),
      quantity: 40,
      price: 42.8,
      fees: 14.95,
      market: "ASX",
      currency: "AUD",
      brokerKey: "au_core",
      securityKey: "BHP",
      notes: "Initial ASX position",
    },
    {
      key: "ivv-buy-1",
      type: "BUY",
      date: isoDateMonthsAgo(12),
      quantity: 18,
      price: 49.2,
      fees: 9.95,
      market: "ASX",
      currency: "AUD",
      brokerKey: "etf",
      securityKey: "IVV",
      notes: "Core ETF exposure",
    },
    {
      key: "bhp-div-1",
      type: "DIVIDEND",
      date: isoDateMonthsAgo(11),
      quantity: 0,
      price: 36,
      fees: 0,
      market: "ASX",
      currency: "AUD",
      brokerKey: "au_core",
      securityKey: "BHP",
      total_amount: 36,
      notes: "Half-year dividend",
    },
    {
      key: "msft-buy-1",
      type: "BUY",
      date: isoDateMonthsAgo(10),
      quantity: 6,
      price: 388.5,
      fees: 3,
      market: "NASDAQ",
      currency: "USD",
      brokerKey: "us_growth",
      securityKey: "MSFT",
      notes: "US growth allocation",
    },
    {
      key: "cba-buy-1",
      type: "BUY",
      date: isoDateMonthsAgo(8),
      quantity: 12,
      price: 113.4,
      fees: 12.5,
      market: "ASX",
      currency: "AUD",
      brokerKey: "au_core",
      securityKey: "CBA",
      notes: "Banking allocation",
    },
    {
      key: "ivv-div-1",
      type: "DIVIDEND",
      date: isoDateMonthsAgo(7),
      quantity: 0,
      price: 28,
      fees: 0,
      market: "ASX",
      currency: "AUD",
      brokerKey: "etf",
      securityKey: "IVV",
      total_amount: 28,
      notes: "ETF distribution",
    },
    {
      key: "qqq-buy-1",
      type: "BUY",
      date: isoDateMonthsAgo(6),
      quantity: 4,
      price: 472,
      fees: 3,
      market: "NASDAQ",
      currency: "USD",
      brokerKey: "us_growth",
      securityKey: "QQQ",
      notes: "Benchmark-linked tech exposure",
    },
    {
      key: "bhp-sell-1",
      type: "SELL",
      date: isoDateMonthsAgo(5),
      quantity: 10,
      price: 46.9,
      fees: 14.95,
      market: "ASX",
      currency: "AUD",
      brokerKey: "au_core",
      securityKey: "BHP",
      notes: "Trimmed winner",
    },
    {
      key: "msft-div-1",
      type: "DIVIDEND",
      date: isoDateMonthsAgo(4),
      quantity: 0,
      price: 18,
      fees: 0,
      market: "NASDAQ",
      currency: "USD",
      brokerKey: "us_growth",
      securityKey: "MSFT",
      total_amount: 18,
      notes: "Quarterly dividend",
    },
    {
      key: "ndq-buy-1",
      type: "BUY",
      date: isoDateMonthsAgo(3),
      quantity: 15,
      price: 42.1,
      fees: 9.95,
      market: "ASX",
      currency: "AUD",
      brokerKey: "etf",
      securityKey: "NDQ",
      notes: "Additional Nasdaq ETF exposure",
    },
    {
      key: "ivv-sell-1",
      type: "SELL",
      date: isoDateMonthsAgo(2),
      quantity: 4,
      price: 55.3,
      fees: 9.95,
      market: "ASX",
      currency: "AUD",
      brokerKey: "etf",
      securityKey: "IVV",
      notes: "Portfolio rebalance",
    },
    {
      key: "cba-div-1",
      type: "DIVIDEND",
      date: isoDateMonthsAgo(1),
      quantity: 0,
      price: 42,
      fees: 0,
      market: "ASX",
      currency: "AUD",
      brokerKey: "au_core",
      securityKey: "CBA",
      total_amount: 42,
      notes: "Bank dividend",
    },
    {
      key: "bhp-buy-2",
      type: "BUY",
      date: isoDateMonthsAgo(0),
      quantity: 8,
      price: 44.2,
      fees: 14.95,
      market: "ASX",
      currency: "AUD",
      brokerKey: "au_core",
      securityKey: "BHP",
      notes: "Top-up purchase",
    },
  ].map((activity) => {
    const linkedSecurity = security(activity.securityKey);
    const linkedBroker = broker(activity.brokerKey);
    const totalAmount =
      activity.total_amount ??
      Number((activity.quantity * activity.price).toFixed(2));

    return {
      ...activity,
      total_amount: totalAmount,
      broker_id: linkedBroker.id,
      security_id: linkedSecurity.id,
      code: linkedSecurity.symbol,
      name: linkedSecurity.name,
      security_name: linkedSecurity.name,
      exchange: linkedSecurity.exchange,
    };
  });
}

function buildSnapshots(uid, activities) {
  const holdings = {};
  let totalCost = 0;
  let realisedGain = 0;

  const snapshots = new Map();

  for (const activity of [...activities].sort((left, right) => left.date.localeCompare(right.date))) {
    const symbol = activity.code;
    const market = activity.market || "OTHER";
    const quantity = Number(activity.quantity || 0);
    const fees = Number(activity.fees || 0);
    const totalAmount = Number(activity.total_amount || 0);

    if (!holdings[symbol]) {
      holdings[symbol] = {
        qty: 0,
        costBasis: 0,
        market,
      };
    }

    if (activity.type === "BUY") {
      holdings[symbol].qty += quantity;
      holdings[symbol].costBasis += totalAmount + fees;
      totalCost += totalAmount + fees;
    }

    if (activity.type === "SELL") {
      const avgCost =
        holdings[symbol].qty > 0 ? holdings[symbol].costBasis / holdings[symbol].qty : 0;
      holdings[symbol].qty -= quantity;
      holdings[symbol].costBasis -= avgCost * quantity;
      realisedGain += totalAmount - fees - avgCost * quantity;
    }

    const marketBreakdown = {};
    let totalValue = 0;

    for (const holding of Object.values(holdings)) {
      if (holding.qty <= 0 || holding.costBasis <= 0) {
        continue;
      }

      marketBreakdown[holding.market] =
        (marketBreakdown[holding.market] || 0) + holding.costBasis;
      totalValue += holding.costBasis;
    }

    snapshots.set(activity.date, {
      user_id: uid,
      date: activity.date,
      total_value: Number(totalValue.toFixed(2)),
      total_cost: Number(totalCost.toFixed(2)),
      total_gain: Number((totalValue - totalCost + realisedGain).toFixed(2)),
      daily_change: null,
      cash_balance: 0,
      market_breakdown: Object.fromEntries(
        Object.entries(marketBreakdown).map(([key, value]) => [key, Number(value.toFixed(2))])
      ),
      seed_demo: true,
    });
  }

  return [...snapshots.values()];
}

async function deleteSeededDocs(db, collectionName, uid) {
  const snapshot = await db.collection(collectionName).where("user_id", "==", uid).get();
  const docsToDelete = snapshot.docs.filter((doc) => doc.data().seed_demo === true);

  if (!docsToDelete.length) {
    return 0;
  }

  const batch = db.batch();
  for (const doc of docsToDelete) {
    batch.delete(doc.ref);
  }
  await batch.commit();
  return docsToDelete.length;
}

async function ensureSecurity(db, security) {
  const existingSnapshot = await db
    .collection("securities")
    .where("symbol", "==", security.symbol)
    .get();

  const existing = existingSnapshot.docs.find(
    (doc) => doc.data().exchange === security.exchange
  );

  if (existing) {
    return { id: existing.id, ...existing.data() };
  }

  const payload = {
    symbol: security.symbol,
    name: security.name,
    exchange: security.exchange,
    currency: security.currency,
    asset_class: security.asset_class || "Equity",
    sector: security.sector || "",
  };

  const docRef = await db.collection("securities").add(payload);
  return { id: docRef.id, ...payload };
}

async function seedDemoUser(email) {
  const { auth, db } = ensureAdmin();
  let userRecord;

  try {
    userRecord = await auth.getUserByEmail(email);
  } catch (error) {
    throw new Error(
      `No Firebase Auth user found for ${email}. Register that user first, then rerun the seeder.`
    );
  }

  const uid = userRecord.uid;

  const deleted = {
    activities: await deleteSeededDocs(db, "activities", uid),
    brokers: await deleteSeededDocs(db, "brokers", uid),
    snapshots: await deleteSeededDocs(db, "portfolio_snapshots", uid),
  };

  const brokerPayloads = {
    au_core: {
      user_id: uid,
      name: "NexaFlow Demo AU Broker",
      description: "Primary Australian equities account",
      created_at: new Date().toISOString(),
      seed_demo: true,
    },
    us_growth: {
      user_id: uid,
      name: "NexaFlow Demo US Broker",
      description: "US growth and technology account",
      created_at: new Date().toISOString(),
      seed_demo: true,
    },
    etf: {
      user_id: uid,
      name: "NexaFlow Demo ETF Broker",
      description: "ETF and passive allocation account",
      created_at: new Date().toISOString(),
      seed_demo: true,
    },
  };

  const brokers = {};
  for (const [key, payload] of Object.entries(brokerPayloads)) {
    const docRef = await db.collection("brokers").add(payload);
    brokers[key] = { id: docRef.id, ...payload };
  }

  const securities = {};
  for (const security of [
    { symbol: "BHP", name: "BHP Group", exchange: "ASX", currency: "AUD", sector: "Materials" },
    { symbol: "IVV", name: "iShares S&P 500 ETF", exchange: "ASX", currency: "AUD", asset_class: "ETF" },
    { symbol: "MSFT", name: "Microsoft Corp", exchange: "NASDAQ", currency: "USD", sector: "Technology" },
    { symbol: "CBA", name: "Commonwealth Bank", exchange: "ASX", currency: "AUD", sector: "Financials" },
    { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NASDAQ", currency: "USD", asset_class: "ETF" },
    { symbol: "NDQ", name: "Betashares Nasdaq 100 ETF", exchange: "ASX", currency: "AUD", asset_class: "ETF" },
  ]) {
    const ensured = await ensureSecurity(db, security);
    securities[security.symbol] = ensured;
  }

  const activities = buildDemoActivities({ brokers, securities }).map((activity) => ({
    ...activity,
    user_id: uid,
    created_at: new Date().toISOString(),
    seed_demo: true,
  }));

  const activityBatch = db.batch();
  for (const activity of activities) {
    const ref = db.collection("activities").doc();
    activityBatch.set(ref, activity);
  }
  await activityBatch.commit();

  const snapshots = buildSnapshots(uid, activities);
  const snapshotBatch = db.batch();
  for (const snapshot of snapshots) {
    const ref = db.collection("portfolio_snapshots").doc(`${uid}_${snapshot.date}`);
    snapshotBatch.set(ref, snapshot, { merge: true });
  }
  await snapshotBatch.commit();

  await db.collection("user_settings").doc(uid).set(
    {
      user_id: uid,
      default_currency: "AUD",
      theme: "light",
      exchange_rates: {
        USD_AUD: "1.53",
        GBP_AUD: "1.96",
      },
      notification_preferences: {},
      updated_at: new Date().toISOString(),
      seed_demo: true,
    },
    { merge: true }
  );

  await db.collection("users").doc(uid).set(
    {
      uid,
      email: userRecord.email,
      first_name: userRecord.displayName?.split(" ")[0] || "Demo",
      last_name: userRecord.displayName?.split(" ").slice(1).join(" ") || "User",
      avatar_url: userRecord.photoURL || null,
      is_admin: false,
      plan: "premium",
      updated_at: new Date().toISOString(),
      seed_demo_last_run_at: new Date().toISOString(),
    },
    { merge: true }
  );

  return {
    email,
    uid,
    deleted,
    created: {
      brokers: Object.keys(brokers).length,
      activities: activities.length,
      snapshots: snapshots.length,
    },
  };
}

const email = process.argv[2] || "one@test.com";

seedDemoUser(email)
  .then((result) => {
    console.log(`Seeded demo data for ${result.email} (${result.uid})`);
    console.log(`Deleted prior demo docs:`, result.deleted);
    console.log(`Created:`, result.created);
  })
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
