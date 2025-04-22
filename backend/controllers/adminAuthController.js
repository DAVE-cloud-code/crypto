const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ fullname, username, email, password: hashedPassword });

    res.status(201).json({
      status: "success",
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        fullname: admin.fullname,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body; // login can be email or username

  try {
    // Find the user by email or username
    const admin = await Admin.findOne({
      $or: [
        { email: usernameOrEmail },
        { username: usernameOrEmail}
      ]
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        fullname: admin.fullname,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
