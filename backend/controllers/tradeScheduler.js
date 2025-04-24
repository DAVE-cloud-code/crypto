const cron = require("node-cron");
const User = require("../models/User");

// Run every 1 minute
cron.schedule("* * * * *", async () => {
  try {
    const users = await User.find({ "trades.status": "open" });

    for (const user of users) {
      let updated = false;
      const openTrades = user.trades.filter(trade => trade.status === "open");

      // Sort by openedAt for predictable processing
      openTrades.sort((a, b) => new Date(a.openedAt) - new Date(b.openedAt));

      // Process in chunks of 3 trades
      for (let i = 0; i < openTrades.length; i += 3) {
        const tradeBatch = openTrades.slice(i, i + 3);
        let wins = 0;

        for (let trade of tradeBatch) {
          const opened = new Date(trade.openedAt);
          const now = new Date();

          // Parse duration ("1h" or "30m")
          const duration = trade.duration.toLowerCase();
          let ms = 0;
          if (duration.endsWith("h")) {
            ms = parseInt(duration) * 60 * 60 * 1000;
          } else if (duration.endsWith("m")) {
            ms = parseInt(duration) * 60 * 1000;
          }

          // Check if trade is expired
          if (now - opened >= ms) {
            trade.status = "closed";
            trade.closedAt = now;

            // Win logic — first 2 in every batch of 3 are wins
            if (wins < 2) {
              const profit = trade.amount * 0.4;
              user.profitBalance += trade.amount + profit;
              wins++;
            }

            updated = true;
          }
        }
      }

      if (updated) await user.save();
    }
  } catch (err) {
    console.error("Error checking trade expiries:", err);
  }
});
