import bcrypt from "bcrypt";
import { Account_Model } from "../../modules/auth/auth.schema";

const seedSuperAdmin = async () => {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

  if (!superAdminEmail) {
    throw new Error("SUPER_ADMIN_EMAIL not found in env");
  }

  const isExist = await Account_Model.findOne({ email: superAdminEmail });

  if (isExist) {
    console.log(" Super Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD as string,
    10
  );

  await Account_Model.create({
    email: superAdminEmail,
    password: hashedPassword,
    role: ["SUPER_ADMIN"],
    activeRole: "SUPER_ADMIN",
    isVerified: true,
  });

  console.log(" Super Admin created successfully");
};

export default seedSuperAdmin;
