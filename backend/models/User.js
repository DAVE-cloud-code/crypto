const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: false},
  password: { type: String, required: true },
  resetToken: { type: String },
resetTokenExpiry: { type: Date },
role: { type: String, default: "user", enum: ["user", "admin"] },
trades: { type: [Object], default: [] },
deposits: { type: [Object], default: [] },
withdrawals: { type: [Object], default: [] },
transactions: { type: [Object], default: [] },
commodities: { type: [Object], default: [] },
balance: { type: Number, default: 0 },
profit: { type: Number, default: 0 },

  agreedToTerms: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
