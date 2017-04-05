(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './values', './promises', './validators', './polyfills'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./values'), require('./promises'), require('./validators'), require('./polyfills'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.values, global.promises, global.validators, global.polyfills);
    global.index = mod.exports;
  }
})(this, function (exports, _values, _promises, _validators2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.cancelPromise = exports.reflectPromise = exports.getDecrementValue = exports.getInitialValue = exports.getNextValue = exports.getEventValue = exports.valueIsEvent = exports.validators = undefined;
  Object.defineProperty(exports, 'valueIsEvent', {
    enumerable: true,
    get: function () {
      return _values.valueIsEvent;
    }
  });
  Object.defineProperty(exports, 'getEventValue', {
    enumerable: true,
    get: function () {
      return _values.getEventValue;
    }
  });
  Object.defineProperty(exports, 'getNextValue', {
    enumerable: true,
    get: function () {
      return _values.getNextValue;
    }
  });
  Object.defineProperty(exports, 'getInitialValue', {
    enumerable: true,
    get: function () {
      return _values.getInitialValue;
    }
  });
  Object.defineProperty(exports, 'getDecrementValue', {
    enumerable: true,
    get: function () {
      return _values.getDecrementValue;
    }
  });
  Object.defineProperty(exports, 'reflectPromise', {
    enumerable: true,
    get: function () {
      return _promises.reflectPromise;
    }
  });
  Object.defineProperty(exports, 'cancelPromise', {
    enumerable: true,
    get: function () {
      return _promises.cancelPromise;
    }
  });

  var _validators = _interopRequireWildcard(_validators2);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  exports.validators = _validators;
});