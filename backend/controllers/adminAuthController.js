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
  try {
    const { usernameOrEmail, password } = req.body;

    const admin = await Admin.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });

    if (!admin) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, "secret", { expiresIn: "1d" });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        fullname: admin.fullname,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
