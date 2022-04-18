/* eslint-disable no-tabs */
import cors from "cors";
import path from "path";
import fs, { appendFileSync } from "fs";
import { isAsyncFunction } from "util/types";
import { assert } from "console";
import minimal from "./src/minimal";

const app = minimal();

app.use(cors());

//================ GET ====================//
app.get("/about", (req, res) => {
	res.send("I am the about page via GET\n");
});

app.get("/", (req, res) => {
	fs.readFile(
		path.resolve(__dirname, "..", "public", "index.html"),
		(err, data) => {
			if (err) {
				console.log("Get / Errored!\n");
				console.log(err);
				return res.status(500).send("Error Occurred\n");
			}
			return res.status(200).send(data);
		}
	);
});

//================ PUT ====================//
app.put("/about", (req, res) => {
	res.send("I am the about page via PUT\n");
});

app.put("/", (req, res) => {
	fs.readFile(
		path.resolve(__dirname, "..", "public", "put.html"),
		(err, data) => {
			if (err) {
				console.log("Get / Errored!\n");
				console.log(err);
				return res.status(500).send("Error Occurred\n");
			}
			return res.status(200).send(data);
		}
	);
});

//================ POST ====================//
app.post("/about", (req, res) => {
	res.send("I am the about page via POST\n");
});

app.post("/", (req, res) => {
	fs.readFile(
		path.resolve(__dirname, "..", "public", "post.html"),
		(err, data) => {
			if (err) {
				console.log("Get / Errored!\n");
				console.log(err);
				return res.status(500).send("Error Occurred\n");
			}
			return res.status(200).send(data);
		}
	);
});
//================ DELETE ====================//
app.del("/about", (req, res) => {
	res.send("I am the about page via DELETE\n");
});

app.del("/", (req, res) => {
	fs.readFile(
		path.resolve(__dirname, "..", "public", "delete.html"),
		(err, data) => {
			if (err) {
				console.log("Get / Errored!\n");
				console.log(err);
				return res.status(500).send("Error Occurred\n");
			}
			return res.status(200).send(data);
		}
	);
});
//================ PATCH ====================//
app.patch("/about", (req, res) => {
	res.send("I am the about page via PATCH\n");
});

app.patch("/", (req, res) => {
	fs.readFile(
		path.resolve(__dirname, "..", "public", "patch.html"),
		(err, data) => {
			if (err) {
				console.log("Get / Errored!\n");
				console.log(err);
				return res.status(500).send("Error Occurred\n");
			}
			return res.status(200).send(data);
		}
	);
});

const server = app.listen(8080, () => {
	console.log("Server is running");
});

export function addNumbersTestExample(a, b) {
	return a + b;
}

module.exports = app;
