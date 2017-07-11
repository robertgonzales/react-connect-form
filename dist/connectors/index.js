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


  var Example1 = function Example1(_ref) {
    var signIn = _ref.signIn;

    return React.createElement(
      Form,
      { onSubmit: signIn },
      React.createElement(Field, { name: "name", component: TextInput }),
      React.createElement(Field, { name: "password", component: PasswordInput }),
      React.createElement(Submit, { component: SubmitButton })
    );
  };

  var Example2 = function Example2(_ref2) {
    var signIn = _ref2.signIn;

    return React.createElement(Form, { component: SignUpForm });
  };

  var Example3 = function Example3(_ref3) {
    var signIn = _ref3.signIn;

    return React.createElement(Form, {
      onSubmit: signIn,
      render: function render(formProps) {
        return React.createElement(
          "form",
          null,
          React.createElement(Field, { name: "name", component: TextInput }),
          React.createElement(Field, { name: "password", component: PasswordInput }),
          React.createElement(Submit, { component: SubmitButton })
        );
      }
    });
  };

  var Example4 = function Example4(_ref4) {
    var signIn = _ref4.signIn;

    return React.createElement(
      Form,
      { onSubmit: signIn },
      function (formProps) {
        return React.createElement(
          "form",
          null,
          React.createElement(Field, { name: "name", component: TextInput }),
          React.createElement(Field, { name: "password", component: PasswordInput }),
          React.createElement(Submit, { component: SubmitButton })
        );
      }
    );
  };
});