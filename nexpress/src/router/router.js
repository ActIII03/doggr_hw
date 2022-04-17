/* eslint-disable no-tabs */
import { Route } from "./route.js";
import { Layer } from "./layer.js";

export class Router {
	constructor() {
		this.stack = [
			new Layer("*", (req, res) => {
				res.statusCode = 404;
				res.setHeader("Content-Type", "text/plain");
				res.end(`Cannot find ${req.url}`);
			}),
		];
	}

	// app.get("/about", (req, res) => {
	//   res.send("I am the about page via GET");
	// });
	get(path, handler) {
		console.log("In Router.get() with path: ", path);
		const route = this.route(path);
		route.get(handler);
		return this;
	}

	put(path, handler) {
		console.log("In Router.put() with path: ", path);
		const route = this.route(path);
		route.put(handler);
		return this;
	}

	post(path, handler) {
		console.log("In Router.post() with path: ", path);
		const route = this.route(path);
		route.post(handler);
		return this;
	}

	del(path, handler) {
		console.log("In Router.del() with path: ", path);
		const route = this.route(path);
		route.del(handler);
		return this;
	}

	patch(path, handler) {
		console.log("In Router.patch() with path: ", path);
		const route = this.route(path);
		route.patch(handler);
		return this;
	}

	route(path) {
		console.log("In router.route()");
		const route = new Route(path);
		const layer = new Layer(path, (req, res) => route.dispatch(req, res));
		layer.route = route;
		this.stack.push(layer);

		return route;
	}

	handle(req, res) {
		console.log("In router.handle()");
		const method = req.method;
		let found = false;

		this.stack.some((item, index) => {
			if (index === 0) {
				return false;
			}
			const { matched = false, params = {} } = item.match(req.pathname);
			if (matched && item.route && item.route.requestHandler(method)) {
				found = true;
				req.params = params;
				return item.requestHandler(req, res);
			}
		});

		return found ? null : this.stack[0].requestHandler(req, res);
	}
}
