import mongoose from "mongoose";
import app from "./app";
import { configs } from "./app/configs";
import seedSuperAdmin from "./app/utils/seeders/superAdmin.seeder";
import { generateQRCode } from "./app/utils/qrCode.ts/qrCodeGenerate";
async function main() {
  await mongoose.connect(configs.db_url!);

  await seedSuperAdmin(); // runs once safely
  app.listen(configs.port, () => {
    console.log(`Server listening on port ${configs.port}`);
  });
}
main().catch((err) => console.log(err));
