export function checkMiddlewareInputs(args) {
  let path = "*";
  let handler = null;

  if (args.length === 2) [path, handler] = args;
  else handler = args[0];

  if (typeof path !== "string") {
    throw new Error("Path needs to be either a string");
  } else if (typeof handler !== "function") {
    throw new Error("Middleware needs to be a function");
  }

  return {
    path,
    handler,
  };
}

// Given 2 path strings, tokenize them into arrays via path separator
// piecewise match them to see if equal
// while also grabbing :-prefixed tokens as params
//"/users/admin"
export function matchPath(setupPath, currentPath) {
  const setupPathArray = setupPath.split("/");
  const currentPathArray = currentPath.split("/");
  //setupPath[0] == "users"
  //setupPath[1] == "admin"

  let match = true;
  const params = {};

  for (let i = 0; i < setupPathArray.length; i++) {
    const route = setupPathArray[i];
    const path = currentPathArray[i];
    if (route[0] === ":") {
      params[route.substr(1)] = path;
    } else if (route === "*") {
      break;
    } else if (route !== path) {
      match = false;
      break;
    }
  }

  const isMatch = match ? { matched: true, params } : { matched: false };

  return isMatch;
}

// Never forget, strings are the devil and we want to use them NEVER
// https://www.sohamkamani.com/javascript/enums/#enums-with-symbols
export const HTTPVerbs = {
  POST: "post",
  GET: "get",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};