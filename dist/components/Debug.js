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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var getChanges = function getChanges(prev, next) {
    if (!prev) {
      return;
    }
    if (!Object.keys(prev).length) {
      return;
    }
    return Object.keys(prev).reduce(function (changes, key) {
      if (prev[key] !== next[key]) {
        if (Array.isArray(prev[key])) {
          if (prev[key].length !== next[key].length || prev[key].some(function (item, index) {
            return item !== next[key][index];
          })) {
            changes.push('\t' + key + ': ' + JSON.stringify(prev[key]) + ' => ' + JSON.stringify(next[key]));
          }
        } else if (_typeof(prev[key]) === 'object') {
          var childChanges = getChanges(prev[key], next[key]);
          if (childChanges) {
            changes.push(key + '\n' + childChanges);
          }
        } else {
          changes.push('\t' + key + ': ' + JSON.stringify(prev[key]) + ' => ' + JSON.stringify(next[key]));
        }
      }
      return changes;
    }, []).join('\n');
  };

  var Debug = function (_Component) {
    _inherits(Debug, _Component);

    function Debug(props, context) {
      _classCallCheck(this, Debug);

      var _this = _possibleConstructorReturn(this, (Debug.__proto__ || Object.getPrototypeOf(Debug)).call(this, props, context));

      if (!context._form) throw new Error('Debug must be inside Form');
      return _this;
    }

    _createClass(Debug, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var _this2 = this;

        var nextForm = nextContext._form;
        return Object.keys(nextProps).some(function (key) {
          return nextProps[key] !== _this2.props[key];
        }) || Object.keys(nextForm).some(function (key) {
          return nextForm[key] !== _this2.form[key];
        });
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState, prevContext) {
        var _prevContext$_form = prevContext._form,
            prevFields = _prevContext$_form.fields,
            prevForm = _objectWithoutProperties(_prevContext$_form, ['fields']);

        var _context$_form = this.context._form,
            nextFields = _context$_form.fields,
            nextForm = _objectWithoutProperties(_context$_form, ['fields']);

        if (this.props.log) {
          if (this.props.name) {
            console.log(getChanges(prevFields[name], nextFields[name]));
          } else if (this.props.fields) {
            console.log(getChanges(prevFields, nextFields));
          } else {
            console.log(getChanges(prevForm, nextForm));
          }
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _form = this.form,
            fields = _form.fields,
            rest = _objectWithoutProperties(_form, ['fields']);

        if (!this.props.render) {
          return null;
        }
        return _react2.default.createElement(
          'pre',
          null,
          _react2.default.createElement(
            'code',
            null,
            this.props.name ? JSON.stringify(fields[name], null, 2) : this.props.field ? JSON.stringify(fields, null, 2) : JSON.stringify(rest, null, 2)
          )
        );
      }
    }, {
      key: 'form',
      get: function get() {
        return this.context._form;
      }
    }]);

    return Debug;
  }(_react.Component);

  Debug.displayName = 'Debug';
  Debug.contextTypes = {
    _form: _react.PropTypes.object.isRequired
  };
  Debug.propTypes = {
    name: _react.PropTypes.string,
    fields: _react.PropTypes.bool,
    render: _react.PropTypes.bool,
    log: _react.PropTypes.bool
  };
  Debug.defaultProps = {
    log: true
  };
  exports.default = Debug;
});