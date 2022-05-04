import cors from "cors";
import path from "path";
import fs, { appendFileSync } from "fs";
import { isAsyncFunction } from "util/types";
import { assert } from "console";
import express from "express";
import { MongoClient } from "mongodb";
import setupRoutes from "./src/routes";

async function test_database() {
  // Note the first instance of doggrdb is the hostname we just gave it
  // whereas the second will be the specific database/collection we use
  const dbUrl = "mongodb://doggrdb:27017/doggrdb";
  const client = new MongoClient(dbUrl);


  console.log("Connecting to database");
  await client.connect();
  console.log("connected to db");
  const db = client.db();
  const collection = db.collection('documents');
  console.log("Opened collection successfully");


  // Create
  const insertResult = await collection.insertOne({ name: "Doggr", count: 1 });
  console.log("Inserted data=>", insertResult);

  // Read
  const findResult = await collection.find({}).toArray();
  console.log('Found documents =>', findResult);

  // Update
  const updateResult = await collection.updateOne({ name: "Doggr" }, { $set: { count: 2 } });
  console.log('Updated documents =>', updateResult);

  // Delete
  const deleteResult = await collection.deleteMany({ name: "Doggr" });
  console.log('Deleted documents =>', deleteResult);

}

async function main() {
  //test_database();
  
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