/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
/* eslint-disable no-tabs */
import { assert } from "console";
import { addNumbersTestExample as addNumbers } from "./server";
import Minimal from "./src/minimal";

// NOTE: I could not figure out how to use jest. Not finished.

describe("Server test suite", () => {
	it("Should add 2+3 properly to 5", () => {
		let result = addNumbers(2, 3);

		expect(result).toBe(5);
	});
});

//================== Armant's tests =================//
const request = require("supertest");

const app = Minimal();

// PUT

describe("Test the root path", () => {
	test("It should response the PUT method", (done) => {
		request(app)
			.put("/")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});

// POST

describe("Test the root path", () => {
	test("It should response the POST method", (done) => {
		request(app)
			.post("/")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});

//DELETE

describe("Test the root path", () => {
	test("It should response the DELETE method", (done) => {
		request(app)
			.post("/")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});

//PATCH

describe("Test the root path", () => {
	test("It should response the PATCH method", (done) => {
		request(app)
			.patch("/")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});
