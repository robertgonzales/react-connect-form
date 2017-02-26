
// returns promise that converts error into successful resolution
export const reflectPromise = (promise) => promise.catch(err => err)

// returns promise that can be canceled
export const cancelPromise = (promise, canceled) => {
  return new Promise((resolve, reject) => {
    promise.then(val => canceled ? reject({ canceled: true }) : resolve(val))
    promise.catch(error => canceled ? reject({ canceled: true }) : reject(error))
  })
}
