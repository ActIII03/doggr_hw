import "dotenv/config";
import cors from "cors";
import path from "path";

import fs, { appendFileSync } from "fs";
import { isAsyncFunction } from "util/types";
import { assert } from "console";
import express from "express";

import setupRoutes from "./routes";



async function main() {


  // Don't interfere with Jest/supertest!
  if (process.env.NODE_ENV !== 'test') {
    const app = express();
    setupRoutes(app);

    const server = await app.listen(9000, () => {
      console.log("Server is running");
    });
  }
}

main();