(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react", "../utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("../utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.utils);
    global.Field = mod.exports;
  }
})(this, function (exports, _react, _utils) {
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

  var Field = function (_Component) {
    _inherits(Field, _Component);

    function Field(props, context) {
      _classCallCheck(this, Field);

      var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, props, context));

      _this.handleChange = function (e) {
        var value = (0, _utils.getEventValue)(e, _this.props);
        if (_this.props.onChange && _this.props.onChange(e) === false) return;
        _this.context._form.changeField(_this.props.name, value);
      };

      _this.handleFocus = function (e) {
        if (_this.props.onFocus && _this.props.onFocus(e) === false) return;
        _this.context._form.focusField(_this.props.name);
      };

      _this.handleBlur = function (e) {
        if (_this.props.onBlur && _this.props.onBlur(e) === false) return;
        _this.context._form.blurField(_this.props.name);
      };

      if (!context._form) {
        throw new Error("Field must be inside Form");
      }
      return _this;
    }

    _createClass(Field, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        this.context._form.registerField(this.props.name, this.props);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.context._form.unregisterField(this.props.name, this.props);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.name !== this.props.name) {
          this.context._form.unregisterField(this.props.name, this.props);
          this.context._form.registerField(nextProps.name, nextProps);
        }
        if (!(0, _utils.deepEqual)(nextProps.initialValue, this.props.initialValue) || nextProps.initialChecked !== this.props.initialChecked) {
          this.context._form.resetField(nextProps.name, nextProps);
        }
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var _this2 = this;

        var nextField = nextContext._form.fields[nextProps.name];
        var nextValues = nextContext._form.values;
        if (!this.field) return true;
        return Object.keys(nextProps).some(function (key) {
          return nextProps[key] !== _this2.props[key];
        }) || Object.keys(nextField).some(function (key) {
          return nextField[key] !== _this2.field[key];
        }) || Object.keys(nextValues).some(function (key) {
          return nextValues[key] !== _this2.values[key];
        });
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.field) return null;

        var _props = this.props,
            initialChecked = _props.initialChecked,
            initialValue = _props.initialValue,
            validators = _props.validators,
            component = _props.component,
            render = _props.render,
            rest = _objectWithoutProperties(_props, ["initialChecked", "initialValue", "validators", "component", "render"]);

        var inputProps = _extends({}, rest, {
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          checked: this.checked,
          value: this.value
        });
        var passProps = _extends({
          values: this.values
        }, this.field, inputProps);
        if (typeof render === "function") {
          return render(passProps);
        } else if (typeof component === "string") {
          return _react2.default.createElement(component, inputProps);
        } else if (component) {
          return _react2.default.createElement(component, passProps);
        } else {
          return null;
        }
      }
    }, {
      key: "field",
      get: function get() {
        return this.context._form.fields[this.props.name];
      }
    }, {
      key: "values",
      get: function get() {
        return this.context._form.values;
      }
    }, {
      key: "value",
      get: function get() {
        if (this.props.type === "radio" || this.props.type === "checkbox") {
          if (this.props.value === undefined) {
            return true;
          }
          return this.props.value;
        }
        if (this.props.type === "text" || this.props.type === "email" || this.props.type === "password") {
          return this.field.value || "";
        }
        return this.field.value;
      }
    }, {
      key: "checked",
      get: function get() {
        if (this.props.type === "radio" || this.props.type === "checkbox") {
          if (Array.isArray(this.field.value)) {
            return this.field.value.indexOf(this.value) > -1;
          } else {
            return this.field.value === this.value;
          }
        }
      }
    }, {
      key: "valid",
      get: function get() {
        return this.field.errors.length < 1;
      }
    }]);

    return Field;
  }(_react.Component);

  Field.displayName = "Field";
  Field.contextTypes = {
    _form: _react.PropTypes.object.isRequired
  };
  Field.propTypes = {
    name: _react.PropTypes.string.isRequired,
    type: _react.PropTypes.string,
    render: _react.PropTypes.func,
    component: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
    validators: _react.PropTypes.array,
    onChange: _react.PropTypes.func,
    onFocus: _react.PropTypes.func,
    onBlur: _react.PropTypes.func
  };
  Field.defaultProps = {
    component: "input",
    validators: []
  };
  exports.default = Field;
});