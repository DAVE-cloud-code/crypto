const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); // Adjust path if needed
const dotenv = require('dotenv');

dotenv.config()

const MONGO = process.env.MONGODB_URI
// Connect to MongoDB
mongoose.connect(MONGO,)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Admin details
const newAdmin = {
  fullname: "Admin User2",
  username: "admin1",
  email: "admin@gmail.com",
  password: "OREANtrader123",
};

// Function to create admin
const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(newAdmin.password, 12);
    const admin = await Admin.create({
      ...newAdmin,
      password: hashedPassword
    });
    console.log("Admin created:", admin);
  } catch (err) {
    console.error("Error creating admin:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
