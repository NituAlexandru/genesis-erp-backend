// seedAdmin.js
import connectDB from "./src/config/db.js";
import User from "./src/modules/users/userModel.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  await connectDB();

  const username = "Administrator";
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    console.log("Administrator already exists.");
  } else {
    const defaultPassword = "admin1234"; // parola de start ușoară
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const adminUser = new User({
      username: "Administrator",
      name: "Administrator",
      email: "seedadmin@example.com", // poți schimba dacă dorești
      password: hashedPassword,
      role: "Administrator",
    });
    await adminUser.save();
    console.log("Administrator created successfully!");
    console.log("Default password is:", defaultPassword);
  }
  process.exit();
};

seedAdmin();
