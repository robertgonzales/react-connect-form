import React, { Component, PropTypes } from 'react'
import {
  cancelPromise,
  reflectPromise,
  getNextValue,
  getValidators,
  getInitialValue,
  getDecrementValue,
} from '../utils'

export default class Form extends Component {
  static displayName = 'Form'

  static propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    onSubmitFailure: PropTypes.func
  }

  static contextTypes = {
    _form: PropTypes.object
  }

  static defaultProps = {
    initialValues: {},
    onSubmit: (e) => console.log('onSubmit', e),
    onSubmitSuccess: (e) => console.log('onSubmitSuccess', e),
    onSubmitFailure: (e) => console.log('onSubmitFailure', e)
  }

  static childContextTypes = {
    _form: PropTypes.object.isRequired
  }

  state = {
    fields: {},
    submitting: false,
    submitFailure: null,
    submitSuccess: null
  }
  validators = {}
  initialValues = {}

  getChildContext () {
    return {
      _form: {
        unregisterField: this.unregisterField,
        registerField: this.registerField,
        changeField: this.changeField,
        resetField: this.resetField,
        focusField: this.focusField,
        blurField: this.blurField,
        submitting: this.state.submitting,
        fields: this.state.fields,
        pristine: this.pristine,
        focused: this.focused,
        touched: this.touched,
        values: this.values,
        errors: this.errors,
        valid: this.valid,
        submit: this.submit,
        reset: this.reset
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.initialValues !== this.props.initialValues) {
      Object.keys(nextProps.initialValues).forEach(name => {
        this.resetField(name, nextProps.initialValues[name])
      })
    }
  }

  componentDidMount () {
    this._isUnmounted = false
  }

  componentWillUnmount () {
    this._isUnmounted = true
  }

  cancelOnUnmount = (promise) => {
    return cancelPromise(promise, this._isUnmounted)
  }

  get pristine () {
    return Object.values(this.state.fields).every(field => field.pristine)
  }

  get touched () {
    return Object.values(this.state.fields).some(field => field.touched)
  }

  get valid () {
    return Object.values(this.state.fields).every(field => field.errors.length < 1)
  }

  get focused () {
    return Object.keys(this.state.fields).find(name => this.state.fields[name].focused)
  }

  get values () {
    return Object.keys(this.state.fields).reduce((values, name) => {
      values[name] = this.state.fields[name].value
      return values
    }, {})
  }

  get errors () {
    return Object.keys(this.state.fields).reduce((errors, name) => {
      if (this.state.fields[name].errors.length) {
        errors[name] = this.state.fields[name].errors
      }
      return errors
    }, {})
  }

  get element () {
    return this.context._form ? 'div' : 'form'
  }

  registerField = (name, fieldProps) => {
    this.validators[name] = getValidators(fieldProps)
    this.setState(prevState => {
      const prevField = prevState.fields[name]
      // recalculate initial values
      if (this.props.initialValues[name]) {
        this.initialValues[name] = this.props.initialValues[name]
      } else {
        this.initialValues[name] = getInitialValue(prevField, fieldProps)
      }
      // field namespace is already registered.
      if (prevField) {
        return {
          fields: {
            ...prevState.fields,
            [name]: {
              ...prevField,
              // increment field count.
              count: prevField.count + 1,
              value: this.initialValues[name]
            }
          }
        }
      // create new field namespace.
      } else {
        return {
          fields: {
            ...prevState.fields,
            [name]: {
              type: fieldProps.type,
              count: 1,
              errors: [],
              touched: false,
              focused: false,
              pristine: true,
              validated: true,
              validating: false,
              value: this.initialValues[name]
            }
          }
        }
      }
    })
  }

  unregisterField = (name, fieldProps) => {
    this.setState(prevState => {
      const prevField = prevState.fields[name]
      // multiple fields registered to the same name.
      if (prevField.count > 1) {
        return {
          fields: {
            ...prevState.fields,
            [name]: {
              ...prevField,
              // decrement field count.
              count: prevField.count - 1,
              value: getDecrementValue(prevField, fieldProps)
              // TODO: run validation again?
            }
          }
        }
      // only one field registered to name.
      } else {
        delete this.validators[name]
        delete this.initialValues[name]
        return {
          fields: Object.keys(prevState.fields).reduce((fields, key) => {
            if (key !== name) {
              fields[key] = prevState.fields[key]
            }
            return fields
          }, {})
        }
      }
    })
  }

  resetField = (name, fieldProps) => {
    this.setState(prevState => {
      const prevField = prevState.fields[name]
      if (this.props.initialValues[name]) {
        this.initialValues[name] = this.props.initialValues[name]
      } else if (fieldProps) {
        this.initialValues[name] = getInitialValue(prevField, fieldProps)
      }
      return {
        fields: {
          ...prevState.fields,
          [name]: {
            ...prevField,
            touched: false,
            pristine: true,
            validated: true,
            validating: false,
            value: this.initialValues[name]
          }
        }
      }
    })
  }

  changeField = (name, event) => {
    this.setState(prevState => {
      const prevField = prevState.fields[name]
      const value = getNextValue(event, prevField)
      // TODO: ensure this is actually merging setStates
      if (prevField.errors.length) {
        this.validateField(name, value)
      }
      // FIXME: just testing!
      this.props.onChange && this.props.onChange({ ...this.values, [name]: value })
      return {
        fields: {
          ...prevState.fields,
          [name]: {
            ...prevField,
            value: value,
            touched: true,
            validated: value === prevField.value,
            pristine: this.initialValues[name] === value
          }
        }
      }
    })
  }

  focusField = (name) => {
    this.setState(prevState => {
      return {
        fields: {
          ...prevState.fields,
          [name]: {
            ...prevState.fields[name],
            focused: true
          }
        }
      }
    })
  }

  blurField = (name) => {
    this.setState(prevState => {
      return {
        fields: {
          ...prevState.fields,
          [name]: {
            ...prevState.fields[name],
            focused: false,
            touched: true
          }
        }
      }
    })
    this.validateField(name, this.state.fields[name].value)
  }

  // TODO: better name (also unwarns field)
  warnField = (name, errors, validating) => {
    errors = errors.filter(err => err).map(err => err.message || err)
    this.setState(prevState => {
      return {
        fields: {
          ...prevState.fields,
          [name]: {
            ...prevState.fields[name],
            errors: errors,
            validating: validating,
            validated: !errors.length && !validating
          }
        }
      }
    })
  }

  validateField = (name, value) => {
    if (!this.shouldFieldValidate(name, value)) {
      return Promise.resolve()
    }
    // TODO: how should user build async errors? Promise.reject/resolve()
    const { syncErrors, asyncErrors } = this.runFieldValidations(name, value)
    const hasSync = syncErrors.length > 0
    const hasAsync = asyncErrors.length > 0
    // if no syncErrors, this will clear errors
    this.warnField(name, syncErrors, hasAsync)
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
    Object.keys(this.state.fields).forEach(name => this.resetField(name))
  }

  render () {
    return React.createElement(this.element, {
      onSubmit: (e) => { e.preventDefault() },
      children: this.props.children
    })
  }
}
