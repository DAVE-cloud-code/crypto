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
    const { asset, amount } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTrade = {
      asset,
      amount,
      status: "active",
      openedAt: new Date()
    };

    user.trades.push(newTrade);
    await user.save();

    res.status(201).json({ message: "Trade added", trade: newTrade });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4. Add a Commodity
exports.addCommodity = async (req, res) => {
  try {
    const { name, quantity, value } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.commodities.push({ name, quantity, value });
    await user.save();

    res.status(201).json({ message: "Commodity added", name });
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
        balance: user.balance,
        profit: user.profit,
        deposits: user.deposits,
        withdrawals: user.withdrawals,
        transactions: user.transactions,
        activeTrades,
        allTrades: user.trades,
        commodities: user.commodities
      };
  
      res.status(200).json(dashboardInfo);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  