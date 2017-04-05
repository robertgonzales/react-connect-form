(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Debug', './Form', './Field', './Submit', './Reset'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Debug'), require('./Form'), require('./Field'), require('./Submit'), require('./Reset'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Debug, global.Form, global.Field, global.Submit, global.Reset);
    global.index = mod.exports;
  }
})(this, function (exports, _Debug2, _Form2, _Field2, _Submit2, _Reset2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Reset = exports.Submit = exports.Field = exports.Form = exports.Debug = undefined;

  var _Debug3 = _interopRequireDefault(_Debug2);

  var _Form3 = _interopRequireDefault(_Form2);

  var _Field3 = _interopRequireDefault(_Field2);

  var _Submit3 = _interopRequireDefault(_Submit2);

  var _Reset3 = _interopRequireDefault(_Reset2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Debug = _Debug3.default;
  exports.Form = _Form3.default;
  exports.Field = _Field3.default;
  exports.Submit = _Submit3.default;
  exports.Reset = _Reset3.default;
});