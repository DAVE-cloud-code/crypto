// models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  cryptoType: {
    type: String,
    enum: ['ethereum', 'usdt(trc20)', 'btc', 'usdc(ethereum)'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wallet', walletSchema);
