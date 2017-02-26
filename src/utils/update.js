import update from 'immutability-helper'

// extends update with $unset command -- immutable delete
update.extend('$unset', function(keysToRemove, original) {
  let copy = Object.assign({}, original)
  for (const key of keysToRemove) delete copy[key]
  return copy
})

export default update
