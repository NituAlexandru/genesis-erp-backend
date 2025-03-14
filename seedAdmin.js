// seedAdmin.js
import connectDB from "./src/config/db.js";
import User from "./src/modules/users/userModel.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  await connectDB();

  const username = "seedAdministrator";
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    console.log("Seed administrator already exists.");
  } else {
    const hashedPassword = await bcrypt.hash("Parola", 10); // schimbă cu o parolă puternică
    const adminUser = new User({
      username: "Administrator",
      name: "Administrator",
      email: "seedadmin@example.com", 
      password: hashedPassword,
      role: "Administrator",
    });
    await adminUser.save();
    console.log("Seed administrator created successfully!");
  }
  process.exit();
};

seedAdmin();
