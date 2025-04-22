const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// Admin details
const newAdmin = {
  fullname: "Admin User",
  username: "admin",
  email: "admin45@gmail.com",
  password: "OREANtrader2003",
  role: "admin", // You can set this to "admin" or "superadmin"
};

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectToDB();

    const existingAdmin = await Admin.findOne({
      $or: [{ email: newAdmin.email }, { username: newAdmin.username }],
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash(newAdmin.password, 12);

    const admin = await Admin.create({
      fullname: newAdmin.fullname,
      username: newAdmin.username,
      email: newAdmin.email,
      password: hashedPassword,
      role: newAdmin.role,
    });

    console.log("✅ Admin created successfully:", {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  } finally {
    mongoose.connection.close(() => {
      console.log("🔌 MongoDB connection closed");
    });
  }
};

createAdmin();
