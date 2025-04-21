const User = require("../models/User");

// Send bonus to user
exports.sendBonus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bonusBalance += amount;
    await user.save();

    res.status(200).json({ message: "Bonus sent", bonusBalance: user.bonusBalance });
  } catch (err) {
    res.status(500).json({ message: "Failed to send bonus", error: err.message });
  }
};
