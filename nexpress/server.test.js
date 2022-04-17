import { assert } from "console";
import { addNumbersTestExample as addNumbers } from "./server";
import { get, post, put, del, patch } from "./server";

describe("Server test suite", () => {
	it("Should add 2+3 properly to 5", () => {
		let result = addNumbers(2, 3);

		expect(result).toBe(5);
	});
});
