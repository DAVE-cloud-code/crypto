// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];

//   if (!token) return res.status(403).json({ message: "No token provided" });

//   jwt.verify(token, "secret", (err, decoded) => {
//     if (err) return res.status(401).json({ message: "Unauthorized" });

//     req.userId = decoded.id;
//     next();
//   });
// };

// module.exports = verifyToken;


const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Access denied. No token." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
