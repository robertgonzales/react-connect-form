import './polyfills'
export * as validators from './validators'
export { reflectPromise, cancelPromise } from './promises'
export {
  valueIsEvent,
  getEventValue,
  getNextValue,
  getInitialValue,
  getDecrementValue,
  getValidators
} from './values'
export deepEqual from 'deep-equal'

// async function validateField(name, value) {
//   if (!this.shouldFieldValidate(name, value)) {
//     return
//   }
//   const { syncErrors, asyncErrors } = this.runFieldValidations(name, value)
//   if (syncErrors.length) {
//     this.warnField(name, syncErrors, !!asyncErrors.length)
//     if (!asyncErrors.length) {
//       return
//     }
//   }
//   if (asyncErrors.length) {
//     try {
//       const reflectErrors = asyncErrors.map(reflectPromise)
//       if (asyncErrors.length > 1) {
//         const error = await this.cancelOnUnmount(Promise.race(reflectErrors))
//         this.warnField(name, [...error, ...syncErrors], true)
//       }
//       const errors = await this.cancelOnUnmount(Promise.all(reflectErrors))
//       this.warnField(name, [...errors, ...syncErrors], false)
//       return errors
//     } catch (err) {
//       throw err
//     }
//   }
// }
