/* eslint-disable dot-notation */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-tabs */
import { Layer } from "./layer";

export class Route {
	constructor(path) {
		this.path = path;
		// pile of layers
		this.stack = [];
		this.methods = {};
	}

	//===================  GET  =========================//
	get(handler) {
		const layer = new Layer("/", handler);
		layer.method = "get";
		this.methods["get"] = true;
		this.stack.push(layer);
		return this;
	}
	//===================  PUT   =========================//
	put(handler) {
		const layer = new Layer("/", handler);
		layer.method = "put";
		this.methods["put"] = true;
		this.stack.push(layer);
		return this;
	}
	//===================  POST  =========================//
	post(handler) {
		const layer = new Layer("/", handler);
		layer.method = "post";
		this.methods["post"] = true;
		this.stack.push(layer);
		return this;
	}
	//=================== DELETE =========================//
	del(handler) {
		const layer = new Layer("/", handler);
		layer.method = "delete";
		this.methods["delete"] = true;
		this.stack.push(layer);
		return this;
	}
	//=================== PATCH =========================//
	patch(handler) {
		const layer = new Layer("/", handler);
		layer.method = "patch";
		this.methods["patch"] = true;
		this.stack.push(layer);
		return this;
	}

	requestHandler(method) {
		const name = method.toLowerCase();
		return Boolean(this.methods[name]);
	}

	dispatch(req, res) {
		const method = req.method.toLowerCase();

		this.stack.forEach((item) => {
			if (method === item.method) {
				item.requestHandler(req, res);
			}
		});
	}
}
