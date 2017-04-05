import React, { Component, PropTypes } from 'react'
import { update, cancelPromise, reflectPromise, getInitialValue } from '../utils'

export default class Form extends Component {

  static displayName = 'Form'

  static propTypes = {
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    onSubmitFailure: PropTypes.func
  }

  static defaultProps = {
    onSubmit: (arg) => console.log("onSubmit", arg),
    onSubmitSuccess: (arg) => console.log("onSubmitSuccess", arg),
    onSubmitFailure: (arg) => console.log("onSubmitFailure", arg),
  }

  static childContextTypes = {
    _form: PropTypes.object.isRequired
  }

  state = {
    fields: {},
    submitting: false,
  }

  validators = {}

  getChildContext() {
    return {
      _form: {
        unregisterField: this.unregisterField,
        registerField: this.registerField,
        changeField: this.changeField,
        focusField: this.focusField,
        blurField: this.blurField,
        getField: this.getField,
        pristine: this.pristine,
        touched: this.touched,
        values: this.values,
        errors: this.errors,
        valid: this.valid,
        submit: this.submit,
        reset: this.reset,
      }
    }
  }

  componentDidMount() {
    this._isUnmounted = false
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  cancelOnUnmount = (promise) => {
    return cancelPromise(promise, this._isUnmounted)
  }

  get values() {
    return Object.keys(this.state.fields).reduce((values, name) => {
      if (!this.state.fields[name].value) return values
      return { ...values, [name]: this.state.fields[name].value }
    }, {})
  }

  get pristine() {
    return Object.keys(this.state.fields).reduce((pristine, name) => {
      return pristine ? this.state.fields[name].pristine : false
    }, true)
  }

  get touched() {
    return Object.keys(this.state.fields).reduce((touched, name) => {
      return touched ? true : this.state.fields[name].touched
    }, false)
  }

  get focused() {
    return Object.keys(this.state.fields).reduce((focused, name) => {
      return focused ? focused : this.state.fields[name].focused ? name : null
    }, null)
  }

  get errors() {
    return Object.keys(this.state.fields).reduce((errors, name) => {
      if (!this.state.fields[name].errors.length) return errors
      return { ...errors, [name]: this.state.fields[name].errors }
    }, {})
  }

  get valid() {
    return Object.keys(this.state.fields).reduce((valid, name) => {
      return valid ? !this.state.fields[name].errors.length : false
    }, true)
  }

  registerField = (name, type, validators) => {
    this.validators[name] = validators
    this.setState(prevState => {
      const field = prevState.fields[name]
      // field namespace is already registered.
      if (field) {
        return update(prevState, {
          fields: {
            [name]: { $merge: {
              // increment field count.
              count: field.count + 1,
              value: getInitialValue(field, type)
            }}
          }
        })
      // create new field namespace.
      } else {
        return update(prevState, {
          fields: { $merge: {
            [name]: {
              count: 1,
              type: type,
              errors: [],
              touched: false,
              focused: false,
              pristine: true,
              validated: true,
              validating: false,
              // TODO: get value for input type, handle default value
              value: this.props.initialValues ? this.props.initialValues[name] : null
            }
          }}
        })
      }
    })
  }

  unregisterField = (name) => {
    delete this.validators[name]
    this.setState(prevState => {
      const field = prevState.fields[name]
      // multiple fields registered to the same name.
      if (field.count > 1) {
        return update(prevState, {
          fields: {
            [name]: {
              // decrement field count.
              // TODO: changes to value or validation?
              count: { $set: field.count - 1 }
            }
          }
        })
      // only one field registered to name.
      } else {
        return update(prevState, {
          // completely remove field namespace.
          fields: { $unset: [name] }
        })
      }
    })
  }

  getField = (name) => {
    return this.state.fields[name]
  }

  changeField = (name, value) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            value: value,
            touched: true,
            validated: value === prevState.fields[name].value,
            // TODO: handle initialValues and defaultValues
            pristine: !!(this.props.initialValues && this.props.initialValues[name] === value)
          }}
        }
      })
      // TODO: merge synchronous validation changes
      if (this.state.fields[name].errors.length) {
        this.validateField(name, value)
      }
    })
  }

  focusField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: {
            focused: { $set: true }
          }
        }
      })
    })
  }

  blurField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            focused: false,
            touched: true
          }}
        }
      })
    })
    this.validateField(name, this.state.fields[name].value)
  }

  // TODO: better name (also unwarns field)
  warnField = (name, errors, validating) => {
    errors = errors.filter(err => err).map(err => err.message || err)
    return new Promise(resolve => {
      this.setState(prevState => {
        return update(prevState, {
          fields: {
            [name]: { $merge: {
              errors: errors,
              validating: validating,
              validated: !errors.length && !validating,
            }}
          }
        })
      }, resolve)
    })
  }

  // TODO: merge blur/change updates into sync updates
  validateField = (name, value) => {
    if (!this.shouldFieldValidate(name, value)) {
      return Promise.resolve()
    }
    // TODO: how should user build async errors? Promise.reject/resolve()
    const { syncErrors, asyncErrors } = this.runFieldValidations(name, value)
    const hasSync = syncErrors.length > 0
    const hasAsync = asyncErrors.length > 0
    if (hasSync) {
      this.warnField(name, syncErrors, hasAsync)
    }
    if (hasAsync) {
      // treat each error as successful resolve so we can handle all of them.
      const reflectErrors = asyncErrors.map(reflectPromise)
      // update field for first error when there are multiple async errors.
      if (asyncErrors.length > 1) {
        // wait for first error to resolve.
        // cancel if error resolves after unmount.
        this.cancelOnUnmount(Promise.race(reflectErrors))
          // update field after first error resolves.
          .then(error => this.warnField(name, [error, ...syncErrors], true))
      }
      // wait for all errors to resolve.
      // cancel if errors resolve after unmount.
      return this.cancelOnUnmount(Promise.all(reflectErrors))
        // update field after errors resolve.
        .then(errors => this.warnField(name, [...errors, ...syncErrors], false))
    } else {
      Promise.resolve()
    }
  }

  shouldFieldValidate = (name, nextValue) => {
    const { validated } = this.state.fields[name]
    if (validated) return false
    return true
  }

  runFieldValidations = (name, value) => {
    return this.validators[name].reduce((errors, validator) => {
      let err = validator(value, this.values)
      if (!err) {
        return errors
      } else if (typeof err === 'string' || err instanceof Error) {
        errors.syncErrors.push(err)
      } else if (typeof err.then === 'function') {
        errors.asyncErrors.push(err)
      } else {
        throw new Error('validation must return a String, Error, or Promise')
      }
      return errors
    }, { syncErrors: [], asyncErrors: [] })
  }

  validateForm = () => {
    // resolve if ALL fields are valid.
    // reject if ANY fields are invalid.
    return Promise.all(
      // run validation for every field.
      Object.keys(this.state.fields).reduce((validations, name) => {
        // each validation resolves when field was updated with latest error state.
        // should only fail to resolve if form unmounts.
        return [...validations, this.validateField(name, this.state.fields[name].value)]
      }, [])
    )
  }

  // form hooks

  handleSubmit = (isValid) => {
    const { onSubmit } = this.props
    if (this.valid) {
      return onSubmit && onSubmit(this.values)
    } else {
      return Promise.reject(new Error('Form is invalid'))
    }
  }

  handleSubmission = (submission) => {
    const isAsync = submission && typeof submission.then === 'function'
    if (isAsync) {
      this.setState({
        submitting: true,
        submitSuccess: null,
        submitFailure: null
      })
    }
    // force submission into promise.
    return Promise.resolve(submission)
  }

  handleSubmitSuccess = () => {
    this.setState({
      submitting: false,
      submitSuccess: true,
      submitFailure: null
    }, () => {
      this.props.onSubmitSuccess()
    })
  }

  handleSubmitFailure = (err) => {
    this.setState({
      submitting: false,
      submitSuccess: false,
      submitFailure: err ? err.message || err : null
    }, () => {
      this.props.onSubmitFailure(err)
    })
  }

  submit = () => {
    return Promise
      // validate form before submitting.
      .resolve(this.validateForm())
      .then(this.handleSubmit)
      .then(this.handleSubmission)
      .then(this.handleSubmitSuccess)
      .catch(this.handleSubmitFailure)
  }

  reset = () => {

  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <pre>
          <code>
            {JSON.stringify({
              "pristine": this.pristine,
              "touched": this.touched,
              "focused": this.focused,
              "errors": this.errors,
              "valid": this.valid,
              "fields": this.state.fields,
              "values": this.values,
            }, null, 2)}
          </code>
        </pre>
        {this.props.children}
      </form>
    )
  }

}
