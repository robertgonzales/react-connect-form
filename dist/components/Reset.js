(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.Reset = mod.exports;
  }
})(this, function (exports, _react) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _objectWithoutProperties(obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Reset = function (_Component) {
    _inherits(Reset, _Component);

    function Reset(props, context) {
      _classCallCheck(this, Reset);

      var _this = _possibleConstructorReturn(this, (Reset.__proto__ || Object.getPrototypeOf(Reset)).call(this, props, context));

      _this.handleClick = function (e) {
        _this.context._form.reset();
      };

      if (!context._form) throw new Error("Reset must be inside Form");
      return _this;
    }

    _createClass(Reset, [{
      key: "render",
      value: function render() {
        var _props = this.props,
            component = _props.component,
            render = _props.render,
            rest = _objectWithoutProperties(_props, ["component", "render"]);

        var inputProps = _extends({}, rest, {
          type: "reset",
          onClick: this.handleClick
        });
        if (typeof render === "function") {
          return render(inputProps);
        } else if (component === "button") {
          return _react2.default.createElement(component, inputProps);
        } else if (component) {
          return _react2.default.createElement(component, inputProps);
        } else {
          return null;
        }
      }
    }]);

    return Reset;
  }(_react.Component);

  Reset.displayName = "Reset";
  Reset.contextTypes = {
    _form: _react.PropTypes.object.isRequired
  };
  Reset.defaultProps = {
    component: "button"
  };
  exports.default = Reset;
});