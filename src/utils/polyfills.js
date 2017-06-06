import assign from 'object-assign'
import values from 'object.values'

// ensure spread operator
Object.assign = assign

if (!Object.values) {
  values.shim()
}
