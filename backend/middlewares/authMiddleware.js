const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this path is correct

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ Now req.user contains full user details
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
