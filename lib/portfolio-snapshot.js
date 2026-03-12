import { buildPortfolioSnapshot } from "@/lib/portfolio";

export async function updatePortfolioSnapshot(userId, db, snapshotDate = new Date()) {
  const activitySnapshot = await db
    .collection("activities")
    .where("user_id", "==", userId)
    .get();

  const activities = activitySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const snapshot = buildPortfolioSnapshot(userId, activities, snapshotDate);
  const docId = `${userId}_${snapshot.date}`;

  await db.collection("portfolio_snapshots").doc(docId).set(snapshot, { merge: true });

  return { id: docId, ...snapshot };
}
