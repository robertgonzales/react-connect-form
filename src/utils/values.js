import { isRequired } from './validators'

export const valueIsEvent = e => {
  return !!(e && e.stopPropagation && e.preventDefault)
}

const getCheckboxValue = (propValue, formField) => {
  if (formField.count > 1) {
    let fieldValue = formField.value ? [...formField.value] : []
    const index = fieldValue.indexOf(propValue)
    if (index < 0) {
      fieldValue.push(propValue)
    } else {
      fieldValue.splice(index, 1)
    }
    return fieldValue
  } else {
    return formField.value === undefined ? propValue : undefined
  }
}

export const getNextValue = (eventValue, formField = {}) => {
  if (formField.type === 'checkbox') {
    return getCheckboxValue(eventValue, formField)
  }
  return eventValue
}

export const getDecrementValue = (formField, fieldProps) => {
  if (formField.type === 'checkbox') {
    const fieldValue = [...formField.value]
    const index = fieldValue.indexOf(fieldProps.value)
    if (index > -1) {
      fieldValue.splice(index, 1)
      return fieldValue
    }
  }
  if (formField.type === 'radio') {
    if (formField.value === fieldProps.value) {
      return undefined
    }
  }
  return formField.value
}

export const getEventValue = (event, fieldProps) => {
  const { type, value, multiple } = fieldProps
  if (valueIsEvent(event)) {
    if (type === 'radio' || type === 'checkbox') {
      if (value === undefined) {
        return !!event.target.checked
      }
      return value
    } else if (event.target.options && multiple) {
      return [...event.target.options].filter(o => o.selected).map(o => o.value)
    } else {
      return event.target.value
    }
  }
  return event
}

export const getInitialValue = (formField = {}, fieldProps) => {
  const { type, value, initialChecked, initialValue } = fieldProps
  const { count, value: prevValue } = formField
  if (type === 'checkbox') {
    // checkbox already exists, so initial value must be for multiple checkboxes.
    // need to convert to array of values
    if (count >= 1) {
      // prevValue could be array or scalar value
      let valueArray = prevValue ? [].concat(prevValue) : []
      if (initialChecked) {
        // if initially checked, add to value array
        valueArray.push(value)
      } else {
        // else remove from value array
        const index = valueArray.indexOf(value)
        if (index > -1) {
          valueArray.splice(index, 1)
        }
      }
      return valueArray
    } else {
      if (value === undefined) {
        return !!initialChecked
      }
      return initialChecked ? value : undefined
    }
  }
  if (type === 'radio') {
    return initialChecked ? value : prevValue
  }
  return initialValue
}

export const getValidators = fieldProps => {
  if (fieldProps.required) {
    return [...fieldProps.validators, isRequired]
  }
  return fieldProps.validators
}
