(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './components', './utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./components'), require('./utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.components, global.utils);
    global.index = mod.exports;
  }
})(this, function (exports, _components, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'Debug', {
    enumerable: true,
    get: function () {
      return _components.Debug;
    }
  });
  Object.defineProperty(exports, 'Field', {
    enumerable: true,
    get: function () {
      return _components.Field;
    }
  });
  Object.defineProperty(exports, 'Form', {
    enumerable: true,
    get: function () {
      return _components.Form;
    }
  });
  Object.defineProperty(exports, 'Reset', {
    enumerable: true,
    get: function () {
      return _components.Reset;
    }
  });
  Object.defineProperty(exports, 'Submit', {
    enumerable: true,
    get: function () {
      return _components.Submit;
    }
  });
  Object.defineProperty(exports, 'validators', {
    enumerable: true,
    get: function () {
      return _utils.validators;
    }
  });
});