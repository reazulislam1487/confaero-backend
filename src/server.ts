import mongoose from "mongoose";
import app from "./app";
import { configs } from "./app/configs";
import seedSuperAdmin from "./app/utils/seeders/superAdmin.seeder";
import http from "http";
import { initSocket } from "./app/socket/socket";

async function main() {
  await mongoose.connect(configs.db_url!);

  const server = http.createServer(app);
  //  init socket
  initSocket(server);

  // await seedSuperAdmin(); // runs once safely
  // app.listen(configs.port, () => {
  //   console.log(`Server listening on port ${configs.port}`);
  // });
  server.listen(configs.port, () => {
    console.log(`Server listening on port ${configs.port}`);
  });
}
main().catch((err) => console.log(err));
