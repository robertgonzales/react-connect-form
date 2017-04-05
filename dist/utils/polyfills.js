(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['object-assign'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('object-assign'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.objectAssign);
    global.polyfills = mod.exports;
  }
})(this, function (_objectAssign) {
  'use strict';

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // ensure spread operator
  Object.assign = _objectAssign2.default;

  // TODO: Promise polyfill
});