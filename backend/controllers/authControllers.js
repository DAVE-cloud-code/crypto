const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

exports.register = async (req, res) => {
  try {
    const { fullname, username, email, currency, country, phoneNumber, password, terms } = req.body;

    // Convert the terms field to a boolean (if it's the string 'accepted')
    const agreedToTerms = terms === 'accepted'; // Converts "accepted" to true, any other value to false

    if (!agreedToTerms) return res.status(400).json({ message: "You must agree to the terms" });

    // Check if the user already exists (by email or username)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user instance
    const newUser = new User({
      fullname,
      username,
      email,
      currency,
      country,
      phoneNumber,
      password: hashedPassword,
      agreedToTerms,  // Store the boolean value for terms
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success response
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    // Handle any errors that occur during the registration process
    res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    // Check if the input is an email or username and find the user
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user)
      return res.status(400).json({ status: "error", message: "Invalid credentials" });

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ status: "error", message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });

    // Return response with token and user data
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


// Request Password Reset
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "Email not found" });
  
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000; // 1hr
      await user.save();
  
      res.status(200).json({
        message: "Reset link generated",
        resetLink: `http://localhost:5000/api/auth/reset-password/${token}`
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  // Reset Password
  exports.resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
      });
  
      if (!user) return res.status(400).json({ message: "Invalid or expired token" });
  
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
      user.resetToken = null;
      user.resetTokenExpiry = null;
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  // Fetch all users (Admin only)
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password -resetToken -resetTokenExpiry");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
  };
