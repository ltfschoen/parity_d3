(function(exports) {
  "use strict";

  function isObject(obj) {
    return obj && (typeof obj  === "object");
  }

  function isArray(obj) {
    return isObject(obj) && (obj instanceof Array);
  }

  function toHumanisedAll(str) {
    return str.replace(/\b\w/g, function(l){ return l.toUpperCase() })
  }

  function toHumanisedFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  exports.jobUtils = {
    isObject: isObject,
    isArray: isArray,
    toHumanisedFirst: toHumanisedFirst,
    toHumanisedAll: toHumanisedAll
  };

})(this);