const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "superadmin") {
    return next();
  }

  console.log("Access denied: role is", req.user?.role);
  return res.status(403).json({ message: "Admin access required" });
};
module.exports = isAdmin;