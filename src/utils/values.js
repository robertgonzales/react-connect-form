
const valueIsEvent = (e) => {
  return Boolean(e && e.stopPropagation && e.preventDefault)
}

const getCheckboxValue = (prevValue, nextValue)  => {
  if (Array.isArray(prevValue)) {
    const index = prevValue.indexOf(nextValue)
    if (index < 0) {
      prevValue.push(nextValue)
      return prevValue
    } else {
      prevValue.splice(index, 1)
      return prevValue
    }
  } else {
    return !prevValue
  }
}

export const getValue = (nextValue, prevValue, fieldType)  => {
  if (valueIsEvent(nextValue)) {
    if (fieldType === 'checkbox') {
      return getCheckboxValue(prevValue, nextValue.target.value)
    }
    return nextValue.target.value
  }
  return nextValue
}

// TODO: actually do this
export const getInitialValue = (field, type) => {
  if (type === 'checkbox' && field.count >= 1) {
    return field.value ? [].concat(field.value) : []
  } else {
    return field.value
  }
}
