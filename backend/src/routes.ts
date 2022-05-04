import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import express from "express";


export default function setupRoutes(app) {

  app.use(cors());
  app.use(express.json());

  // We're using a router now, so that we can prefix it with /api/v1 later
  const router = express.Router();

  router.use("/testJson", (req, res) => {
    res.json(req.body);
  });

  router.get("/about", (req, res) => {
    res.status(200).send("about:GET");
  });

  router.get("/", async (req, res) => {
    return getStaticFile(res, "index.html");
  });

  router.post("/postExample", (req, res) => getStaticFile(res, "post.html"));

  router.put("/putExample", (req, res) =>
    getStaticFile(res, "put.html"));

  router.patch("/patchExample", (req, res) => {
    return getStaticFile(res, "patch.html");
  });

  router.delete("/deleteExample", (req, res) => {
    return getStaticFile(res, "delete.html");
  });

  // This will redirect all requests made to /api/vi/... to the router
  app.use("/api/v1", router);

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