import app from "./app";
import "dotenv/config";
import { envConfs } from './conf';
import mongoose, { ConnectOptions } from "mongoose";
import app from './app.js';
import 'dotenv/config';
import envsConfig from './conf/envConfs';


mongoose.set('strictQuery', true);
if (!envsConfig.dbHost) {
    console.error('АЛО!!! ГДЕ dbHost в envConfs!!!!');
    process.exit(1);
}

mongoose
.connect(envConfs.dbHost, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
  .then(() => {
    app.listen(envConfs.port, () => {
      console.log(`Server running. Use our API on port: ${envConfs.port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

    .connect(envsConfig.dbHost)
    .then(() => {
        app.listen(envsConfig.port, () => {
            console.log(
                `Server running. Use our API on port: ${envsConfig.port}`
            );
        });
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });
