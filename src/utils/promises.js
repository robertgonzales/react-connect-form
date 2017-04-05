
// returns promise that converts error into successful resolution
export const reflectPromise = (promise) => promise.catch(err => err)

// returns promise that can be canceled
export const cancelPromise = (promise, cancel) => {
  return new Promise((resolve, reject) => {
    promise.then(val => cancel ? reject({ canceled: true }) : resolve(val))
    promise.catch(error => cancel ? reject({ canceled: true }) : reject(error))
  })
}
