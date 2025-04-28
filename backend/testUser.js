const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // ✅ Adjust path if your model is elsewhere
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
      username: "Alice",
      email: "alicegreat@gmail.com",
      currency: "USD",
      country: "USA",
      password: hashedPassword,
      agreedToTerms: true,
      role: "user",
      mainBalance: 1000000,
      profitBalance: 10000,
      bonusBalance: 50000,
      pendingBonus: 10000, // Added pending bonus
      walletPhrase: [
        "abandon", "ability", "about", "above", "absent", "absorb", "abstract", "absurd",
        "abuse", "access", "accident", "account"  // Sample 12-word wallet phrase
      ],

      deposits: [
        {
          type: "USDT(TRC20)",  // Correct currency type
          amount: 500,
          status: "completed",
          createdAt: new Date()
        }
      ],

      withdrawals: [
        {
          type: "BTC",  // Correct currency type
          amount: 100,
          status: "pending",
          createdAt: new Date()
        }
      ],

      transactions: [
        {
          transactionId: new mongoose.Types.ObjectId(),
          direction: "deposit",  // Direction for deposit
          type: "USDT(TRC20)",  // Correct currency type
          amount: 500,
          status: "completed",
          createdAt: new Date()
        },
        {
          transactionId: new mongoose.Types.ObjectId(),
          direction: "withdrawal",  // Direction for withdrawal
          type: "BTC",  // Correct currency type
          amount: 100,
          status: "pending",
          createdAt: new Date()
        }
      ],

      trades: [
        {
          marketType: "crypto",
          asset: "Bitcoin",
          amount: 200,
          leverage: 5,
          duration: "1h",
          fromBalance: "mainBalance", // valid enum value
          status: "open",
          openedAt: new Date()
        },
        {
          marketType: "indices",
          asset: "S&P 500",
          amount: 300,
          leverage: 2,
          duration: "30m",
          fromBalance: "profitBalance", // valid enum value
          status: "closed",
          openedAt: new Date(Date.now() - 3600000),
          closedAt: new Date()
        }
      ],

      loans: [
        {
          amount: 1000,
          duration: 12, // in months
          interestRate: 0.1,  // 10%
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
