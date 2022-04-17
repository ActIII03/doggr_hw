/* eslint-disable max-len */
/* eslint-disable no-tabs */
import fs from "fs";
import { path as nodePath } from "path";
import http from "http";
import request from "./request";
import response from "./response";
import { checkMiddlewareInputs, matchPath } from "./lib/helpers";
import { Router } from "./router/router";

export default function Minimal() {
	let middlewares = [];

	const router = new Router();
	console.log("Router created");

	function use(...args) {
		console.log("in minimal.use");
		const { path, handler } = checkMiddlewareInputs(args);

		middlewares.push({
			path,
			handler,
		});
	}

	//we have this already
	// app.get("/about", (req, res) => {
	//   res.send("I am the about page via GET");
	// });

	function get(...args) {
		console.log("Inside of Minimal.get() with args: ", args);
		const { path, handler } = checkMiddlewareInputs(args);
		return router.get(path, handler);
	}

	function put(...args) {
		console.log("Inside of Minimal.put() with args: ", args);
		const { path, handler } = checkMiddlewareInputs(args);
		return router.put(path, handler);
	}

	function post(...args) {
		console.log("Inside of Minimal.post() with args: ", args);
		const { path, handler } = checkMiddlewareInputs(args);
		return router.post(path, handler);
	}

	function del(...args) {
		console.log("Inside of Minimal.del() with args: ", args);
		const { path, handler } = checkMiddlewareInputs(args);
		return router.del(path, handler);
	}

	function patch(...args) {
		console.log("Inside of Minimal.patch() with args: ", args);
		const { path, handler } = checkMiddlewareInputs(args);
		return router.patch(path, handler);
	}

	// doggr.com/users/admin
	// app.use("/users/admin", (req, res) => console.log)

	function findNext(req, res) {
		let current = -1;
		const next = () => {
			current += 1;
			const middleware = middlewares[current];

			const { matched = false, params = {} } = middleware
				? matchPath(middleware.path, req.pathname)
				: {};

			if (matched) {
				req.params = params;
				middleware.handler(req, res, next);
			} else if (current <= middlewares.length) {
				// Note this IS recursing!
				next();
			} else {
				req.handler(req, res);
			}
		};
		return next;
	}

	function handle(req, res, callback) {
		req.handler = callback;
		//iterate middelwares and handle
		const next = findNext(req, res);
		next();
	}

	function listen(port, callback) {
		return (
			http
				.createServer((req, res) => {
					// turn node's request/response objects into express versions
					request(req);
					response(res);

					//process middleware
					handle(req, res, () => router.handle(req, res));
				})
				// NOTE THIS IS NOT OUR MINIMAL.listen()
				// This listen function comes from http.createServer -> httpServer.listen
				.listen({ port }, () => {
					if (callback) {
						if (typeof callback === "function") {
							return callback();
						}
						throw new Error("Listen callback is not a function");
					}
				})
		);
	}

	return {
		patch,
		del,
		post,
		put,
		use,
		get,
		listen,
	};
}
