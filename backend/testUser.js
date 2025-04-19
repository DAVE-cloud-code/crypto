// scripts/addTestUser.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // ✅ Adjust path if your model is elsewhere
const dotenv = require("dotenv");
dotenv.config();

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// 2. Create and save a test user
const createTestUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("SoloVictor123##", 10);

    const user = new User({
      fullname: "Solo Vic",
      username: "SoloBTC12",
      email: "solo123@gmail.com",
      currency: "USD",
      country: "USA",
      password: hashedPassword,
      agreedToTerms: true,
      role: "user",
      mainBalance: 1000,
      profitBalance: 250,

      deposits: [
        {
          type: "deposit",
          amount: 500,
          method: "bank transfer",
          date: new Date(),
          status: "completed"
        }
      ],

      withdrawals: [
        {
          type: "withdrawal",
          amount: 100,
          method: "crypto",
          date: new Date(),
          status: "pending"
        }
      ],

      transactions: [
        {
          type: "deposit",
          amount: 500,
          method: "bank transfer",
          date: new Date(),
          status: "completed"
        },
        {
          type: "withdrawal",
          amount: 100,
          method: "crypto",
          date: new Date(),
          status: "pending"
        }
      ],

      trades: [
        {
          marketType: "crypto",
          asset: "Bitcoin",
          amount: 200,
          leverage: 5,
          duration: "1h",
          fromBalance: "mainBalance", // ✅ valid enum value
          status: "open",
          openedAt: new Date()
        },
        {
          marketType: "indices",
          asset: "S&P 500",
          amount: 300,
          leverage: 2,
          duration: "30m",
          fromBalance: "profitBalance", // ✅ valid enum value
          status: "closed",
          openedAt: new Date(Date.now() - 3600000),
          closedAt: new Date()
        }
      ],

      commodities: [
        {
          name: "Gold",
          type: "buy",
          amount: 150,
          date: new Date()
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
