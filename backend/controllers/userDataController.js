const User = require('../models/User');
const Wallet = require('../models/wallet');
const mongoose = require('mongoose');

exports.addDeposit = async (req, res) => {
  try {
    const { amount, type } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const normalizedType = type.trim().replace(/\s+/g, '').toUpperCase();
    const validTypes = ['BTC', 'USDT(TRC20)', 'USDC(ETHEREUM)', 'ETHEREUM'];

    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ message: "Invalid deposit type" });
    }

    const depositId = new mongoose.Types.ObjectId();

    const newDeposit = {
      _id: depositId,
      type: normalizedType,  // Correct type here (e.g., 'BTC', 'USDT(TRC20)', etc.)
      amount,
      status: "pending",
      createdAt: new Date(),
    };

    user.deposits.push(newDeposit);

    const transactionData = {
      transactionId: depositId,
      direction: 'deposit',  // Correct direction here ('deposit' for deposits)
      type: normalizedType,  // Correct type here (same as deposit type)
      amount,
      status: "pending",
      createdAt: new Date(),
    };

    user.transactions.push(transactionData);

    await user.save();

    res.status(201).json({ message: "Deposit added", deposit: newDeposit });
  } catch (err) {
    console.error('Deposit Error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addWithdrawal = async (req, res) => {
  try {
    const { amount, type } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const normalizedType = type.trim().replace(/\s+/g, '').toUpperCase();
    const validTypes = ['BTC', 'USDT(TRC20)', 'USDC(ETHEREUM)', 'ETHEREUM'];

    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({ message: "Invalid withdrawal type" });
    }

    const withdrawalId = new mongoose.Types.ObjectId();

    const withdrawalData = {
      _id: withdrawalId,
      type: normalizedType,  // Correct type here (e.g., 'BTC', 'USDT(TRC20)', etc.)
      amount,
      status: "pending",
      createdAt: new Date(),
    };

    user.withdrawals.push(withdrawalData);

    const transactionData = {
      transactionId: withdrawalId,
      direction: 'withdrawal',  // Correct direction here ('withdrawal' for withdrawals)
      type: normalizedType,  // Correct type here (same as withdrawal type)
      amount,
      status: "pending",
      createdAt: new Date(),
    };

    user.transactions.push(transactionData);

    await user.save();

    res.status(201).json({ message: "Withdrawal request added", withdrawal: withdrawalData });
  } catch (err) {
    console.error('Withdrawal Error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3. Add a Trade
exports.addTrade = async (req, res) => {
  try {
    const {
      marketType,
      asset,
      amount,
      leverage,
      duration,
      fromBalance,
      tradeType // Optional field from frontend
    } = req.body;

    // Validate required fields
    if (!marketType || !asset || !amount || !leverage || !duration || !fromBalance) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tradeAmount = parseFloat(amount);
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount value" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate balance
    if (fromBalance === "mainBalance" && user.mainBalance < tradeAmount) {
      return res.status(400).json({ message: "Insufficient main balance" });
    }

    if (fromBalance === "profitBalance" && user.profitBalance < tradeAmount) {
      return res.status(400).json({ message: "Insufficient profit balance" });
    }

    // Deduct from correct balance
    if (fromBalance === "mainBalance") {
      user.mainBalance -= tradeAmount;
    } else {
      user.profitBalance -= tradeAmount;
    }

    // Create new trade object
    const newTrade = {
      marketType,
      asset,
      amount: tradeAmount,
      leverage,
      duration,
      fromBalance,
      tradeType: tradeType || null, // Optional
      status: "open",
      openedAt: new Date()
    };

    user.trades.push(newTrade);
    await user.save();

    res.status(201).json({ message: "Trade created successfully", trade: newTrade });
  } catch (err) {
    console.error("Trade creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getUserTrades = async (req, res) => {
  try {
    const userId = req.user._id; // Get from auth middleware
    const { status } = req.query;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let filteredTrades = user.trades;
    if (status && status !== "all") {
      filteredTrades = filteredTrades.filter(trade => trade.status === status);
    }

    res.status(200).json({ trades: filteredTrades });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 5. Get All Transactions
// Get all transactions for admin (deposits and withdrawals)
exports.getAllTransactions = async (req, res) => {
  try {
    const users = await User.find({}, 'username email transactions'); // fetch username, email, and transactions

    const allTransactions = [];

    users.forEach(user => {
      user.transactions.forEach(transaction => {
        allTransactions.push({
          userId: user._id,
          username: user.username,
          email: user.email,
          ...transaction._doc // include transaction details
        });
      });
    });

    res.status(200).json({ transactions: allTransactions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// In user controller
exports.updateBalances = async (req, res) => {
  const userId = req.user.id;
  const { mainBalance, bonusBalance, profitBalance } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      mainBalance,
      bonusBalance,
      profitBalance
    });

    res.status(200).json({ message: 'Balances updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update balances' });
  }
};

exports.placeLoan = async (req, res) => {
  try {
    const { amount, duration, monthlyIncome, agreedToLoanTerms } = req.body;

    if (!agreedToLoanTerms) {
      return res.status(400).json({ message: "You must agree to the loan terms." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Interest rate logic (can also be based on amount/duration tiers)
    const getInterestRate = (duration) => {
      if (duration <= 6) return 0.05;
      if (duration <= 12) return 0.1;
      return 0.15;
    };

    const interestRate = getInterestRate(duration);
    const totalInterest = amount * interestRate;
    const totalRepayable = amount + totalInterest;
    const monthlyRepayment = totalRepayable / duration;

    const newLoan = {
      amount,
      duration,
      interestRate,
      totalRepayable,
      monthlyRepayment,
      monthlyIncome,
      agreedToLoanTerms
    };

    user.loans.push(newLoan);
    await user.save();

    res.status(201).json({
      message: "Loan request placed successfully",
      loan: newLoan
    });
  } catch (err) {
    res.status(500).json({
      message: "Loan request failed",
      error: err.message
    });
  }
};


// Get all loans for a user
exports.getUserLoans = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.loans);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch loans", error: err.message });
  }
};


exports.approveLoan = async (req, res) => {
  try {
    const { userId, loanId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const loan = user.loans.id(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.status === "approved") {
      return res.status(400).json({ message: "Loan already approved" });
    }

    loan.status = "approved";
    loan.repaidAt = null; // reset if needed
    user.mainBalance += loan.amount;

    // Optional: Log as a transaction
    user.transactions.push({
      type: "deposit",
      amount: loan.amount,
      status: "completed"
    });

    await user.save();

    res.status(200).json({ message: "Loan approved and credited", loan });
  } catch (err) {
    res.status(500).json({ message: "Loan approval failed", error: err.message });
  }
};

// Update Withdrawal Status
exports.updateWithdrawalStatus = async (req, res) => {
    try {
      const { withdrawalId, status } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const withdrawal = user.withdrawals.id(withdrawalId);
      if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
  
      withdrawal.status = status;
      await user.save();
  
      res.status(200).json({ message: 'Withdrawal status updated', withdrawal });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  
  exports.updateTransactionStatus = async (req, res) => {
    try {
      const { userId, transactionId } = req.params;
      const { status } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const transaction = user.transactions.id(transactionId);
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  
      // Update transaction status
      transaction.status = status;
  
      // Sync related deposit or withdrawal
      if (status === 'completed') {
        if (transaction.direction === 'deposit') {
          user.mainBalance += transaction.amount;
          const deposit = user.deposits.id(transaction.transactionId);
          if (deposit) deposit.status = 'completed';
        } else if (transaction.direction === 'withdrawal') {
          user.mainBalance -= transaction.amount;
          const withdrawal = user.withdrawals.id(transaction.transactionId);
          if (withdrawal) withdrawal.status = 'completed';
        }
      }
  
      await user.save();
  
      res.status(200).json({ message: `Transaction ${status}`, transaction });
    } catch (err) {
      res.status(500).json({ message: "Failed to update transaction", error: err.message });
    }
  };
  
  
  
  // Update user profile details
exports.updateUserProfile = async (req, res) => {
  const { fullname, username, email, phone, country, currency } = req.body;

  try {
    const userId = req.user.id; // This assumes you're using auth middleware that sets req.user

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        username,
        email,
        phone,
        country,
        currency
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile.', error: error.message });
  }
};


  // Fetch User Dashboard Info
  exports.getUserDashboard = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const activeTrades = (user.trades || []).filter(trade => trade.status === 'active');
  
      const dashboardInfo = {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        mainBalance: user.mainBalance,
        profitBalance: user.profitBalance,
        bonusBalance: user.bonusBalance,
        deposits: user.deposits,
        withdrawals: user.withdrawals,
        transactions: user.transactions,
        activeTrades,
        allTrades: user.trades,
        commodities: user.commodities,
        role: user.role,
        country: user.country,
        currency: user.currency
      };
  
      res.status(200).json(dashboardInfo);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  // ➕ Add new wallet (admin only)
exports.addWallet = async (req, res) => {
  try {
    const { type, address } = req.body;

    const existing = await Wallet.findOne({ type });
    if (existing) {
      return res.status(400).json({ message: 'Wallet for this crypto type already exists.' });
    }

    const newWallet = new Wallet({ type, address });
    await newWallet.save();

    res.status(201).json({ message: 'Wallet added successfully.', wallet: newWallet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add wallet', error });
  }
};

// Update an existing wallet
exports.updateWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, address } = req.body;

    const updatedWallet = await Wallet.findByIdAndUpdate(
      id,
      { type, address },
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json(updatedWallet);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update wallet', error });
  }
};


// 🔍 Get wallets (with optional type filtering)
exports.getWallets = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};
    if (type) {
      filter.type = type.toUpperCase(); // Normalize case
    }

    const wallets = await Wallet.find(filter);
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wallets', error });
  }
};

// 🗑️ Delete a wallet by ID (admin only)
exports.deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWallet = await Wallet.findByIdAndDelete(id);

    if (!deletedWallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete wallet', error });
  }
};

// Admin-only fetch of all wallets
exports.getAllWalletsAdmin = async (req, res) => {
  try {
    const wallets = await Wallet.find().sort({ createdAt: -1 });
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve wallets', error });
  }
};
  

// Admin assigns bonus (by username)
exports.assignBonus = async (req, res) => {
  try {
    const { username, amount } = req.body;

    if (!username || !amount) {
      return res.status(400).json({ message: "Username and amount are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add to user's pendingBonus
    user.pendingBonus += Number(amount);

    // Add new bonus object into bonuses array
    user.bonuses.push({
      amount: Number(amount),
      status: 'pending',
      assignedAt: new Date()
    });

    await user.save();

    res.status(200).json({ message: "Bonus assigned successfully." });
  } catch (error) {
    console.error("Assign Bonus Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// User claims bonus
exports.claimBonus = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware that sets req.user

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.pendingBonus <= 0) {
      return res.status(400).json({ message: "No bonus available to claim." });
    }

    // Move pendingBonus to bonusBalance
    user.bonusBalance += user.pendingBonus;
    const claimedAmount = user.pendingBonus;
    user.pendingBonus = 0;

    await user.save();

    res.status(200).json({ 
      message: "Bonus claimed successfully.",
      claimedAmount,
      newBonusBalance: user.bonusBalance
    });
  } catch (error) {
    console.error("Claim Bonus Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Check if user has a pending bonus
exports.checkBonus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ pendingBonus: user.pendingBonus });
  } catch (error) {
    console.error("Check Bonus Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllAssignedBonuses = async (req, res) => {
  try {
    const users = await User.find({}, 'username email bonuses') // only needed fields

    const formattedUsers = users.map(user => ({
      username: user.username,
      email: user.email,
      bonuses: user.bonuses.map(bonus => ({
        amount: bonus.amount,
        assignedAt: bonus.assignedAt,
        claimedAt: bonus.claimedAt,
        status: bonus.status
      }))
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Get All Assigned Bonuses Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


