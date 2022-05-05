import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import express from "express";
import { testMongo, testPostgres } from "./lib/helpers";
import { checkDuplicateEmail } from "./middlewares/verifySignUp";
import { createUser } from "./services/userService";

export default function setupRoutes(app) {

  app.use(cors());
  app.use(express.json());

  // We're using a router now, so that we can prefix it with /api/v1 later
  const router = express.Router();

  router.post("/users", checkDuplicateEmail, createUser );



  router.use("/testJson", (req, res) => {
    res.json(req.body);
  });

  router.get("/about", async (req, res) => {
    res.status(200).send("about:GET");
  });

  router.get("/testMongo", async (req, res) => {
    let mongoinfo = await testMongo();
    res.json(mongoinfo);
  });

  router.get("/testPostgres", async (req, res) => {
    res.json(await testPostgres());
  });

  
  // This will redirect all requests made to /api/vi/... to the router
  app.use("/api/v1", router);

  app.get("/", async (req, res) => {
    return getStaticFile(res, "index.html");
  });

  app.use((req, res, next) => {
    return res.status(404).json({
      message: "This page doesn't exist!",
    });
  });
}


function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

const filePathPrefix = areWeTestingWithJest()
  // Jest
  ? path.resolve(__dirname, "..", "public")
  // Not Jest
  : path.resolve(__dirname, "..", "..", "public");

async function getStaticFile(res, filePath) {
  return fs.readFile(
    path.resolve(filePathPrefix, filePath), "utf8")
    .catch((err) => {
      return res.status(500).send(`Server Error Occurred! ${err}`);
    }).then((file) => {
      res.status(200).send(file);
    });
}