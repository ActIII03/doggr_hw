import { assert } from "console";
import request from "supertest";
import express from "express";

import setupRoutes from "./routes";

const app = express();
setupRoutes(app);

describe("Basic Jest functionality test", () => {
  it("Should add 2+3 properly = 5", () => {
    let result = 2 + 3;
    expect(result).toBe(5);
  });
});

describe("Static Routes", () => {
  it(`responds with "GET to /about" text and 200 status code`, async () => {
    let res = await request(app)
      .get("/about")
      .expect(200);

    expect(res.text).toEqual('about:GET');
  });

  it("responds with 404 when route doesn't exist", async () => {
    let res = await request(app)
      .get("/hellos")
      .expect(404, {
        message: "This page doesn't exist!",
      });
  });

  it("Handles the delete route request properly", async () => {
    let res = await request(app)
      .delete("/deleteExample")
      .expect(200);

    expect(res.text).toContain("Delete");
  });

  it("Handles the PUT route request properly", () => {
    let res = request(app)
      .put("/putExample")
      .expect(200)
      .expect((res) => res.text.includes("Put"));
    return res;
  });

  it("Handles the Patch request properly", () => {
    return request(app)
      .patch("/patchExample")
      .expect(200)
      .expect((res) => {
        assert(res.text.includes("Patch"));
      });
  });

  it("Handles the post request properly", () => {
    return request(app)
      .post("/postExample")
      .expect(200)
      .expect((res) => res.text.includes("Post"));
  });

  it("Rejects all non-matching GET requests to each endpoint", async () => {
    return Promise.all(
      verbs
        .filter((value) => { return value !== "get"; })        
        .map((verb) => {
          return request(app)
            .get(`/${verb}Example`)
            .expect(404);
        }),
    );
  });
});

const verbs = [
  "get",
  "post",
  "patch",
  "put",
  "delete",
];
