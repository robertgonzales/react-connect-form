(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.errors = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getFieldErrors = exports.getFieldErrors = function getFieldErrors(errors) {
    return errors.filter(function (exists) {
      return exists;
    }).map(function (error) {
      return error.message || error;
    });
  };

  var shouldFieldValidate = exports.shouldFieldValidate = function shouldFieldValidate() {
    // TODO:
    return true;
  };

  var runFieldValidations = exports.runFieldValidations = function runFieldValidations(value, values, validators) {
    return validators.reduce(function (errors, validator) {
      var err = validator(value, values);
      if (!err) {
        return errors;
      } else if (typeof err === 'string' || err instanceof Error) {
        errors.syncErrors.push(err);
      } else if (typeof err.then === 'function') {
        errors.asyncErrors.push(err);
      } else {
        throw new Error('validation must return a String, Error, or Promise');
      }
      return errors;
    }, { syncErrors: [], asyncErrors: [] });
  };
});