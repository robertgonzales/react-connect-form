(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', '../utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('../utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.utils);
    global.NewField = mod.exports;
  }
})(this, function (exports, _react, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var NewField = function NewField(props) {

    if (!props.field) return null;

    var value = void 0;
    if (props.type === 'radio' || props.type === 'checkbox') {
      if (_typeof(props.value) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) {
        value = true;
      } else {
        value = props.value;
      }
    } else if (props.type === 'text') {
      value = props.field.value || '';
    } else {
      value = props.field.value;
    }

    var checked = void 0;
    if (props.type === 'radio' || props.type === 'checkbox') {
      if (Array.isArray(props.field.value)) {
        checked = props.field.value.indexOf(value) > -1;
      } else {
        checked = props.field.value === value;
      }
    }

    var initialChecked = props.initialChecked,
        initialValue = props.initialValue,
        validators = props.validators,
        component = props.component,
        render = props.render,
        context = props.context,
        field = props.field,
        rest = _objectWithoutProperties(props, ['initialChecked', 'initialValue', 'validators', 'component', 'render', 'context', 'field']);

    var inputProps = _extends({}, rest, {
      onChange: props.onChange,
      onFocus: props.onFocus,
      onBlur: props.onBlur,
      checked: checked,
      value: value
    });
    var passProps = _extends({}, props.field, inputProps);
    if (component) {
      var Comp = component;
      if (typeof component === 'string') {
        return _react2.default.createElement(Comp, _extends({}, inputProps, { checked: checked, value: value }));
      } else {
        return _react2.default.createElement(Comp, passProps);
      }
    } else if (typeof render === 'function') {
      return render(passProps);
    } else {
      return null;
    }
  };

  var FieldContainer = function (_Component) {
    _inherits(FieldContainer, _Component);

    function FieldContainer(props, context) {
      _classCallCheck(this, FieldContainer);

      var _this = _possibleConstructorReturn(this, (FieldContainer.__proto__ || Object.getPrototypeOf(FieldContainer)).call(this, props, context));

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
        throw new Error('Field must be inside Form');
      }
      return _this;
    }

    _createClass(FieldContainer, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.context._form.registerField(this.props.name, this.props);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context._form.unregisterField(this.props.name);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.name !== this.props.name) {
          this.context._form.unregisterField(this.props.name);
          this.context._form.registerField(nextProps.name, nextProps);
        }
        if (nextProps.initialValue !== this.props.initialValue || nextProps.initialChecked !== this.props.initialChecked) {
          this.context._form.resetField(nextProps.name, nextProps);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(NewField, _extends({}, this.props, {
          field: this.context._form.fields[this.props.name],
          context: this.context,
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur
        }));
      }
    }]);

    return FieldContainer;
  }(_react.Component);

  FieldContainer.displayName = 'FieldContainer';
  FieldContainer.contextTypes = {
    _form: _react.PropTypes.object.isRequired
  };
  FieldContainer.defaultProps = {
    component: 'input',
    validators: []
  };
  exports.default = FieldContainer;
});