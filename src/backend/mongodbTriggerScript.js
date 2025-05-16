//todo update ths to work with our tables, and accounts/transactions/snapshots

exports = async function () {
  const db = context.services.get("mongodb-atlas").db("yourDbName");
  const accounts = db.collection("accounts");
  const transactions = db.collection("transactions");
  const snapshots = db.collection("accountBalanceSnapshots");

  const now = new Date();

  // Calculate end of last month
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // e.g., April 30
  const startOfLastMonth = new Date(
    endOfLastMonth.getFullYear(),
    endOfLastMonth.getMonth(),
    1
  );

  const allAccounts = await accounts.find({}).toArray();

  for (const account of allAccounts) {
    const accountId = account.accountId;

    // Get last snapshot (if any)
    const lastSnapshot = await snapshots
      .find({ accountId: accountId })
      .sort({ snapshotDate: -1 })
      .limit(1)
      .next();

    const snapshotStartDate = lastSnapshot
      ? lastSnapshot.snapshotDate
      : account.createdAt;

    const startingBalance = lastSnapshot
      ? lastSnapshot.balance
      : account.initialBalance;

    // Aggregate sum of transactions from snapshotStartDate to end of last month
    const txAgg = await transactions
      .aggregate([
        {
          $match: {
            accountId: accountId,
            timestamp: {
              $gt: snapshotStartDate,
              $lte: endOfLastMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    const totalChange = txAgg[0]?.total || 0;
    const newBalance = startingBalance + totalChange;

    // Insert new snapshot (if not already created)
    await snapshots.updateOne(
      { accountId: accountId, snapshotDate: endOfLastMonth },
      {
        $setOnInsert: {
          balance: newBalance,
        },
      },
      { upsert: true }
    );
  }

  console.log(
    `✅ Monthly snapshots created for ${allAccounts.length} accounts on ${
      endOfLastMonth.toISOString().split("T")[0]
    }`
  );
};
