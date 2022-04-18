/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
/* eslint-disable no-tabs */
import axois from "axios";
import Minimal from "./src/minimal";

//================== Armant's tests =================//
const request = require("supertest");
const app = Minimal();

// PUT
describe("Test the root path (PUT)", () => {
	test("Response for PUT should be 200", (done) => {
		let result = axois.put("localhost:9000/").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

describe("Test the /about path (PUT)", () => {
	test("Response for PUT should be 200", (done) => {
		let result = axois.put("localhost:9000/about").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

// POST
describe("Test the root path (POST)", () => {
	test("Response for POST should be 200", (done) => {
		let result = axois.post("localhost:9000/").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

describe("Test the /about path (POST)", () => {
	test("Response for PUT should be 200", (done) => {
		let result = axois.post("localhost:9000/about").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

////DELETE
describe("Test the root path (DELETE)", () => {
	test("Response for POST should be 200", (done) => {
		let result = axois.delete("localhost:9000/").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

describe("Test the /about path (DELETE)", () => {
	test("Response for PUT should be 200", (done) => {
		let result = axois.delete("localhost:9000/about").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

// PATCH
describe("Test the root path (PATCH)", () => {
	test("Response for PATCH should be 200", (done) => {
		let result = axois.patch("localhost:9000/").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});

describe("Test the /about path (PATCH)", () => {
	test("Response for PATCH should be 200", (done) => {
		let result = axois.patch("localhost:9000/about").then(function (response) {
			expect(response.statusCode).toBe(200);
		});
		done();
	});
});
