const User = require('../models/User');

// 1. Add a Deposit
exports.addDeposit = async (req, res) => {
  try {
    const { amount, method } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newDeposit = {
      type: "deposit",
      amount,
      method,
      status: "pending"
    };

    user.transactions.push(newDeposit);
    user.deposits.push(newDeposit);
    await user.save();

    res.status(201).json({ message: "Deposit added", deposit: newDeposit });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. Add a Withdrawal
exports.addWithdrawal = async (req, res) => {
  try {
    const { amount, method } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newWithdrawal = {
      type: "withdrawal",
      amount,
      method,
      status: "pending"
    };

    user.transactions.push(newWithdrawal);
    user.withdrawals.push(newWithdrawal);
    await user.save();

    res.status(201).json({ message: "Withdrawal request added", withdrawal: newWithdrawal });
  } catch (err) {
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
exports.getAllTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("transactions");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ transactions: user.transactions });
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
      const { status } = req.body; // expected values: 'approved' or 'failed'
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const transaction = user.transactions.id(transactionId);
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  
      transaction.status = status;
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
  