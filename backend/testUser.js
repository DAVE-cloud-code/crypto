const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // ✅ Adjust path if needed
const dotenv = require("dotenv");
dotenv.config();

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// 2. Create and save a test user
const createTestUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("SoloVictor123##", 10);

    const user = new User({
      fullname: "Alice Great",
      username: "alice23",
      email: "alicegreat23@gmail.com",
      currency: "USD",
      country: "USA",
      phone: "+1234567890", // Added phone number
      password: hashedPassword,
      agreedToTerms: true,
      role: "user",
      mainBalance: 1000000,
      profitBalance: 10000,
      bonusBalance: 50000,
      pendingBonus: 10000,
      resetToken: null,
      resetTokenExpiry: null,
      walletPhrase: [
        "abandon", "ability", "about", "above", "absent", "absorb", "abstract", "absurd",
        "abuse", "access", "accident", "account"
      ],

      // Bonuses
      bonuses: [
        {
          amount: 5000,
          status: "pending",
          assignedAt: new Date(),
          claimedAt: null
        },
        {
          amount: 10000,
          status: "claimed",
          assignedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
          claimedAt: new Date(Date.now() - 86400000 * 2)   // 2 days ago
        }
      ],

      // Deposits
      deposits: [
        {
          type: "USDT(TRC20)",
          amount: 500,
          status: "completed",
          createdAt: new Date()
        }
      ],

      // Withdrawals
      withdrawals: [
        {
          type: "BTC",
          amount: 100,
          status: "pending",
          createdAt: new Date()
        }
      ],

      // Transactions
      transactions: [
        {
          transactionId: new mongoose.Types.ObjectId(),
          direction: "deposit",
          type: "USDT(TRC20)",
          amount: 500,
          status: "completed",
          createdAt: new Date()
        },
        {
          transactionId: new mongoose.Types.ObjectId(),
          direction: "withdrawal",
          type: "BTC",
          amount: 100,
          status: "pending",
          createdAt: new Date()
        }
      ],

      // Trades
      trades: [
        {
          marketType: "crypto",
          asset: "Bitcoin",
          amount: 200,
          leverage: 5,
          duration: "1h",
          fromBalance: "mainBalance",
          status: "open",
          openedAt: new Date()
        },
        {
          marketType: "indices",
          asset: "S&P 500",
          amount: 300,
          leverage: 2,
          duration: "30m",
          fromBalance: "profitBalance",
          status: "closed",
          openedAt: new Date(Date.now() - 3600000),
          closedAt: new Date()
        }
      ],

      // Loans
      loans: [
        {
          amount: 1000,
          duration: 12,
          interestRate: 0.1,
          totalRepayable: 1100,
          monthlyRepayment: 91.67,
          monthlyIncome: 3000,
          agreedToLoanTerms: true,
          status: "approved",
          requestedAt: new Date(),
          repaidAt: null
        }
      ]
    });

    await user.save();
    console.log("✅ Test user created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating test user:", err.message);
    mongoose.disconnect();
  }
};

createTestUser();
