const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: false},
  password: { type: String, required: true },
  resetToken: { type: String },
resetTokenExpiry: { type: Date },
role: { type: String, default: "user", enum: ["user", "admin"] },
  agreedToTerms: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
