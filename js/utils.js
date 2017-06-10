function isObject(obj) {
  return obj && (typeof obj  === "object");
}

function isArray(obj) {
  return isObject(obj) && (obj instanceof Array);
}