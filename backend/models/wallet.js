// models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ETHEREUM', 'USDT(TRC20)', 'BTC', 'USDC(ETHEREUM)'],
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
