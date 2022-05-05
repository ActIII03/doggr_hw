import { Client } from "pg";
import { MongoClient } from "mongodb";

export function checkMiddlewareInputs(args) {
  let path = "*";
  let handler = null;

  if (args.length === 2) [path, handler] = args;
  else handler = args[0];

  if (typeof path !== "string") {
    throw new Error("Path needs to be either a string");
  } else if (typeof handler !== "function") {
    throw new Error("Middleware needs to be a function");
  }

  return {
    path,
    handler,
  };
}

// Given 2 path strings, tokenize them into arrays via path separator
// piecewise match them to see if equal
// while also grabbing :-prefixed tokens as params
//"/users/admin"
export function matchPath(setupPath, currentPath) {
  const setupPathArray = setupPath.split("/");
  const currentPathArray = currentPath.split("/");
  //setupPath[0] == "users"
  //setupPath[1] == "admin"

  let match = true;
  const params = {};

  for (let i = 0; i < setupPathArray.length; i++) {
    const route = setupPathArray[i];
    const path = currentPathArray[i];
    if (route[0] === ":") {
      params[route.substr(1)] = path;
    } else if (route === "*") {
      break;
    } else if (route !== path) {
      match = false;
      break;
    }
  }

  const isMatch = match ? { matched: true, params } : { matched: false };

  return isMatch;
}

// Never forget, strings are the devil and we want to use them NEVER
// https://www.sohamkamani.com/javascript/enums/#enums-with-symbols
export const HTTPVerbs = {
  POST: "post",
  GET: "get",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

export async function testMongo() {
  // Note the first instance of doggrdb is the hostname we just gave it
  // whereas the second will be the specific database/collection we use
  const env = process.env;
  const dbUrl = `mongodb://${env.MONGO_URL}:${env.MONGO_PORT}/${env.MONGO_DB}`;
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

  return {
    insertResult,
    findResult,
    updateResult,
    deleteResult,
  };
}

export async function testPostgres() {

  // Note we don't have to pass any connection string here
  // as Postgres will pull it directly from our .env
  const client = new Client();
  await client.connect();
  const res = await client.query('SELECT $1::text as message', ['Postgres Connection Successful']);
  console.log(res.rows[0].message);
  await client.end();
  return res;
}