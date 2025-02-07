import { Server } from 'http';
import app from './app';
import config from './config';
import mongoose from 'mongoose';
import seedSuperAdmin from './DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

process.on('unhandledRejection', () => {
  console.log(`🤷‍♂️,  unhandled rejection detected. shutting down the server`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`🤷‍♀️, uncaught exception detcted. shutting down the server`);
  process.exit(1);
});
