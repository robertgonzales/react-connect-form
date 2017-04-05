(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'immutability-helper'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('immutability-helper'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.immutabilityHelper);
    global.update = mod.exports;
  }
})(this, function (exports, _immutabilityHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // extends update with $unset command -- immutable delete
  _immutabilityHelper2.default.extend('$unset', function (keysToRemove, original) {
    var copy = Object.assign({}, original);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keysToRemove[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        delete copy[key];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return copy;
  });

  exports.default = _immutabilityHelper2.default;
});