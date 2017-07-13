(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react", "prop-types", "../connectors"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("prop-types"), require("../connectors"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.propTypes, global.connectors);
    global.Submit = mod.exports;
  }
})(this, function (exports, _react, _propTypes, _connectors) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

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

  var Submit = function (_PureComponent) {
    _inherits(Submit, _PureComponent);

    function Submit() {
      _classCallCheck(this, Submit);

      return _possibleConstructorReturn(this, (Submit.__proto__ || Object.getPrototypeOf(Submit)).apply(this, arguments));
    }

    _createClass(Submit, [{
      key: "render",
      value: function render() {
        var _props = this.props,
            render = _props.render,
            component = _props.component,
            passProps = _objectWithoutProperties(_props, ["render", "component"]);

        console.log(passProps);
        if (typeof render === "function") {
          return render(passProps);
        } else if (component === "button") {
          return _react2.default.createElement(component, passProps);
        } else if (component) {
          return _react2.default.createElement(component, passProps);
        } else {
          return null;
        }
      }
    }]);

    return Submit;
  }(_react.PureComponent);

  Submit.displayName = "Submit";
  Submit.propTypes = {
    render: _propTypes2.default.func,
    component: _propTypes2.default.node
  };
  Submit.defaultProps = {
    component: "button"
  };
  exports.default = (0, _connectors.connectSubmit)(Submit);
});