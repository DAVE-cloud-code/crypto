const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()
// Connect to your MongoDB
mongoose.connect(process.env.MONGODB_URI,)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Wallet model
const walletSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['BTC', 'ETHEREUM', 'USDT (TRC20)', 'USDC (ETHEREUM)'],
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Wallet = mongoose.model('Wallet', walletSchema);

// Add wallet function
async function addWallet(type, address) {
  try {
    const newWallet = new Wallet({ type, address });
    await newWallet.save();
    console.log('Wallet added:', newWallet);
  } catch (error) {
    console.error('Error adding wallet:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Example usage
addWallet('USDC (ETHEREUM)', '0xAbC1234567890def1234567890abcdef123hjy65');

