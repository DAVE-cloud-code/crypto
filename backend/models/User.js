const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  marketType: {
    type: String,
    enum: ['stock', 'crypto', 'forex', 'indices'],
    required: true
  },
  asset: { type: String, required: true }, // e.g. Bitcoin, NASDAQ, etc.
  amount: { type: Number, required: true },
  leverage: { type: Number, required: true }, // e.g. 2, 5, 10
  duration: { type: String, required: true }, // e.g. "1h", "30min", or "short-term"
  fromBalance: {
    type: String,
    enum: ['mainBalance', 'profitBalance'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'pending'],
    default: 'pending'
  },
  openedAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
});



const loanSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  duration: { type: Number, required: true }, // in months
  interestRate: { type: Number, required: true }, // e.g., 0.1 for 10%
  totalRepayable: { type: Number },
  monthlyRepayment: { type: Number },
  monthlyIncome: { type: Number, required: true },
  agreedToLoanTerms: { type: Boolean, required: true },
  status: { type: String, enum: ['pending', 'approved', 'repaid'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  repaidAt: { type: Date }
});


// Deposit Schema
const depositSchema = new mongoose.Schema({
  type: { type: String, enum: ['BTC', 'USDT(TRC20)', 'USDC(ETHEREUM)', 'ETHEREUM'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Withdrawal Schema
const withdrawalSchema = new mongoose.Schema({
  type: { type: String, enum: ['BTC', 'USDT(TRC20)', 'USDC(ETHEREUM)', 'ETHEREUM'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  direction: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  type: { type: String, enum: ['BTC', 'USDT(TRC20)', 'USDC(ETHEREUM)', 'ETHEREUM'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const bonusSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'claimed'], default: 'pending' },
  assignedAt: { type: Date, default: Date.now },
  claimedAt: { type: Date }
});

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  walletPhrase: { type: [String], required: true }, // 12-word wallet phrase
  mainBalance: { type: Number, default: 0 },
  profitBalance: { type: Number, default: 0 },
  bonusBalance: { type: Number, default: 0 },
  pendingBonus: { type: Number, default: 0 }, // holds bonus assigned but not yet claimed
  bonuses: [bonusSchema],
  trades: [tradeSchema],
  loans: [loanSchema],
  deposits: [depositSchema],
  withdrawals: [withdrawalSchema],
  transactions: [transactionSchema], // All deposit and withdrawal combined
  agreedToTerms: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
