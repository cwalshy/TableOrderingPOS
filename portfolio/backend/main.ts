import { initServer } from "./server";

const dotenv = require("dotenv");

const result = dotenv.config();

if (result.error) {
  throw result.error;
}
//console.log('Loaded environment config', result.parsed);

initServer();
