(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.Debug = mod.exports;
  }
})(this, function (exports, _react) {
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

  var Debug = function (_Component) {
    _inherits(Debug, _Component);

    function Debug(props, context) {
      _classCallCheck(this, Debug);

      var _this = _possibleConstructorReturn(this, (Debug.__proto__ || Object.getPrototypeOf(Debug)).call(this, props, context));

      if (!context._form) throw new Error('Debug must be inside Form');
      return _this;
    }

    _createClass(Debug, [{
      key: 'render',
      value: function render() {
        var _context$_form = this.context._form,
            fields = _context$_form.fields,
            rest = _objectWithoutProperties(_context$_form, ['fields']);

        return _react2.default.createElement(
          'pre',
          null,
          _react2.default.createElement(
            'code',
            null,
            JSON.stringify(rest, null, 1)
          ),
          this.props.fields && _react2.default.createElement(
            'code',
            null,
            JSON.stringify(fields, null, 1)
          )
        );
      }
    }]);

    return Debug;
  }(_react.Component);

  Debug.displayName = 'Debug';
  Debug.contextTypes = {
    _form: _react.PropTypes.object.isRequired
  };
  exports.default = Debug;
});