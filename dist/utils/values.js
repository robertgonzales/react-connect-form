(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './validators'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./validators'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.validators);
    global.values = mod.exports;
  }
})(this, function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getValidators = exports.getInitialValue = exports.getEventValue = exports.getDecrementValue = exports.getNextValue = exports.valueIsEvent = undefined;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var valueIsEvent = exports.valueIsEvent = function valueIsEvent(e) {
    return !!(e && e.stopPropagation && e.preventDefault);
  };

  var getCheckboxValue = function getCheckboxValue(propValue, formField) {
    if (formField.count > 1) {
      var fieldValue = formField.value ? [].concat(_toConsumableArray(formField.value)) : [];
      var index = fieldValue.indexOf(propValue);
      if (index < 0) {
        fieldValue.push(propValue);
      } else {
        fieldValue.splice(index, 1);
      }
      return fieldValue;
    } else {
      return formField.value === undefined ? propValue : undefined;
    }
  };

  var getNextValue = exports.getNextValue = function getNextValue(eventValue) {
    var formField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (formField.type === 'checkbox') {
      return getCheckboxValue(eventValue, formField);
    }
    return eventValue;
  };

  var getDecrementValue = exports.getDecrementValue = function getDecrementValue(formField, fieldProps) {
    if (formField.type === 'checkbox') {
      var fieldValue = [].concat(_toConsumableArray(formField.value));
      var index = fieldValue.indexOf(fieldProps.value);
      if (index > -1) {
        fieldValue.splice(index, 1);
        return fieldValue;
      }
    }
    if (formField.type === 'radio') {
      if (formField.value === fieldProps.value) {
        return undefined;
      }
    }
    return formField.value;
  };

  var getEventValue = exports.getEventValue = function getEventValue(event, fieldProps) {
    var type = fieldProps.type,
        value = fieldProps.value,
        multiple = fieldProps.multiple;

    if (valueIsEvent(event)) {
      if (type === 'radio' || type === 'checkbox') {
        if (value === undefined) {
          return !!event.target.checked;
        }
        return value;
      } else if (event.target.options && multiple) {
        return [].concat(_toConsumableArray(event.target.options)).filter(function (o) {
          return o.selected;
        }).map(function (o) {
          return o.value;
        });
      } else {
        return event.target.value;
      }
    }
    return event;
  };

  var getInitialValue = exports.getInitialValue = function getInitialValue() {
    var formField = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fieldProps = arguments[1];
    var type = fieldProps.type,
        value = fieldProps.value,
        initialChecked = fieldProps.initialChecked,
        initialValue = fieldProps.initialValue;
    var count = formField.count,
        prevValue = formField.value;

    if (type === 'checkbox') {
      // checkbox already exists, so initial value must be for multiple checkboxes.
      // need to convert to array of values
      if (count >= 1) {
        // prevValue could be array or scalar value
        var valueArray = prevValue ? [].concat(prevValue) : [];
        if (initialChecked) {
          // if initially checked, add to value array
          valueArray.push(value);
        } else {
          // else remove from value array
          var index = valueArray.indexOf(value);
          if (index > -1) {
            valueArray.splice(index, 1);
          }
        }
        return valueArray;
      } else {
        if (value === undefined) {
          return !!initialChecked;
        }
        return initialChecked ? value : undefined;
      }
    }
    if (type === 'radio') {
      return initialChecked ? value : prevValue;
    }
    return initialValue;
  };

  var getValidators = exports.getValidators = function getValidators(fieldProps) {
    if (fieldProps.required) {
      return [].concat(_toConsumableArray(fieldProps.validators), [_validators.isRequired]);
    }
    return fieldProps.validators;
  };
});