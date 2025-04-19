const cron = require("node-cron");
const User = require("../models/User");

// Run every 1 minute
cron.schedule("* * * * *", async () => {
  try {
    const users = await User.find({ "trades.status": "open" });

    for (const user of users) {
      let updated = false;

      user.trades.forEach((trade) => {
        if (trade.status === "open") {
          const opened = new Date(trade.openedAt);
          const now = new Date();

          // Convert duration string like "1h" or "30m"
          const duration = trade.duration.toLowerCase();
          let ms = 0;
          if (duration.endsWith("h")) {
            ms = parseInt(duration) * 60 * 60 * 1000;
          } else if (duration.endsWith("m")) {
            ms = parseInt(duration) * 60 * 1000;
          }

          if (now - opened >= ms) {
            trade.status = "closed";
            trade.closedAt = now;

            // Sample profit/loss logic
            const randomProfit = Math.random() > 0.5;
            const resultAmount = randomProfit ? trade.amount * 1.1 : trade.amount * 0.9;

            if (randomProfit) {
              user.profitBalance += resultAmount - trade.amount; // Profit
            }

            updated = true;
          }
        }
      });

      if (updated) await user.save();
    }
  } catch (err) {
    console.error("Error checking trade expiries:", err);
  }
});
