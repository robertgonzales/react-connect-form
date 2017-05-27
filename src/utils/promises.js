// returns promise that converts error into successful resolution
export const reflectPromise = promise => promise.catch(err => err)

// returns promise that can be canceled
export const cancelPromise = (promise, cancel, error) => {
  return new Promise((resolve, reject) => {
    promise.then(val => (cancel ? reject(error) : resolve(val)))
    promise.catch(err => (cancel ? reject(error) : reject(err)))
  })
}
