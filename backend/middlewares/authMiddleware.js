const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Initialize req.user if it's undefined
    req.user = req.user || {};  // Ensure req.user is defined

    // Set the user ID from the decoded token
    req.user._id = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification failed:', err); // Log the error
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
