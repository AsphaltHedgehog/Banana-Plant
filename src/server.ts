import mongoose from "mongoose";

import app from "./app.js";
import "dotenv/config";
import { envConfs } from './conf';

mongoose.set('strictQuery', true);
if (!envConfs.dbHost) {
  console.error("АЛО!!! ГДЕ dbHost в envConfs!!!!")
  process.exit(1);
}

mongoose
  .connect(envConfs.dbHost)
  .then(() => {
    app.listen(envConfs.port, () => {
      console.log(`Server running. Use our API on port: ${envConfs.port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
