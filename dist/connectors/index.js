(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./connectField", "./connectForm", "./connectSubmit", "./connectReset"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./connectField"), require("./connectForm"), require("./connectSubmit"), require("./connectReset"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.connectField, global.connectForm, global.connectSubmit, global.connectReset);
    global.index = mod.exports;
  }
})(this, function (exports, _connectField2, _connectForm2, _connectSubmit2, _connectReset2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.connectReset = exports.connectSubmit = exports.connectForm = exports.connectField = undefined;

  var _connectField3 = _interopRequireDefault(_connectField2);

  var _connectForm3 = _interopRequireDefault(_connectForm2);

  var _connectSubmit3 = _interopRequireDefault(_connectSubmit2);

  var _connectReset3 = _interopRequireDefault(_connectReset2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.connectField = _connectField3.default;
  exports.connectForm = _connectForm3.default;
  exports.connectSubmit = _connectSubmit3.default;
  exports.connectReset = _connectReset3.default;
});