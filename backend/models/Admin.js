const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "superadmin"] // you can expand this if needed
  }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
