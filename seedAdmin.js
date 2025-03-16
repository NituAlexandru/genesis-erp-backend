import connectDB from "./src/config/db.js";
import User from "./src/modules/users/userModel.js";
import Role from "./src/modules/roles/roleModel.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  await connectDB();

  const adminRole = await Role.findOne({ name: "Administrator" });
  if (!adminRole) {
    console.log("Role 'Administrator' not found. Please create it first.");
    process.exit(1);
  }

  const username = "Administrator";
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    console.log("Administrator already exists.");
  } else {
    const defaultPassword = "admin1234";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const adminUser = new User({
      username: "Administrator",
      name: "Administrator",
      email: "seedadmin@example.com",
      password: hashedPassword,
      role: adminRole._id,
    });
    await adminUser.save();
    console.log("Administrator created successfully!");
    console.log("Default password is:", defaultPassword);
  }
  process.exit();
};

seedAdmin();
