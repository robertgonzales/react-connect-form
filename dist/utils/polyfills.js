(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['object-assign', 'object.values'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('object-assign'), require('object.values'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.objectAssign, global.object);
    global.polyfills = mod.exports;
  }
})(this, function (_objectAssign, _object) {
  'use strict';

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _object2 = _interopRequireDefault(_object);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // ensure spread operator
  Object.assign = _objectAssign2.default;

  if (!Object.values) {
    _object2.default.shim();
  }
});