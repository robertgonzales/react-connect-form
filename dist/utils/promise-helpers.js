(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.promiseHelpers = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  // returns promise that converts error into successful resolution
  var reflectPromise = exports.reflectPromise = function reflectPromise(promise) {
    return promise.catch(function (err) {
      return err;
    });
  };

  // returns promise that can be canceled
  var cancelPromise = exports.cancelPromise = function cancelPromise(promise, canceled) {
    return new Promise(function (resolve, reject) {
      promise.then(function (val) {
        return canceled ? reject({ canceled: true }) : resolve(val);
      });
      promise.catch(function (error) {
        return canceled ? reject({ canceled: true }) : reject(error);
      });
    });
  };
});