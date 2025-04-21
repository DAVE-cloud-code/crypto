module.exports = (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      return next();
    }
    return res.status(403).json({ message: "Admin access required" });
  };
  