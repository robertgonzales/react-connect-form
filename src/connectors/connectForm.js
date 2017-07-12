import React, { Component, PropTypes } from "react"
import {
  deepEqual,
  cancelPromise,
  reflectPromise,
  getNextValue,
  getValidators,
  getInitialValue,
  getDecrementValue,
} from "../utils"

export default function connectForm(ComposedComponent) {
  return class extends Component {
    static displayName = `connectForm(${ComposedComponent.displayName || ""})`

    static propTypes = {
      value: PropTypes.object,
      initialValue: PropTypes.object,
      onSubmit: PropTypes.func,
      onSubmitSuccess: PropTypes.func,
      onSubmitFailure: PropTypes.func,
      onChange: PropTypes.func,
      onPristine: PropTypes.func,
      onDirty: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onValid: PropTypes.func,
      onInvalid: PropTypes.func,
    }

    static contextTypes = {
      _form: PropTypes.object,
    }

    static defaultProps = {
      initialValue: {},
      onSubmit: value => {},
      onSubmitSuccess: result => {},
      onSubmitFailure: err => {},
      onChange: value => {},
      onPristine: () => {},
      onDirty: () => {},
      onFocus: () => {},
      onBlur: () => {},
      onValid: () => {},
      onInvalid: errors => {},
    }

    static childContextTypes = {
      _form: PropTypes.object.isRequired,
    }

    state = {
      fields: {},
      submitting: false,
      submitFailure: null,
      submitSuccess: null,
    }
    validators = {}
    initialValue = {}

    getChildContext() {
      return {
        _form: {
          unregisterField: this.unregisterField,
          registerField: this.registerField,
          changeField: this.changeField,
          resetField: this.resetField,
          focusField: this.focusField,
          blurField: this.blurField,
          submitting: this.state.submitting,
          submitFailure: this.state.submitFailure,
          submitSuccess: this.state.submitSuccess,
          fields: this.state.fields,
          pristine: this.pristine,
          focused: this.focused,
          touched: this.touched,
          value: this.value,
          errors: this.errors,
          valid: this.valid,
          submit: this.submit,
          reset: this.reset,
        },
      }
    }

    componentWillReceiveProps(nextProps, nextState) {
      console.log("componentWillReceiveProps", nextProps.value)
      if (nextProps.value) {
        Object.keys(nextProps.value).forEach(name => {
          if (this.state.fields[name]) {
            if (nextProps.value[name] !== this.state.fields[name].value) {
              this.setState(prevState => {
                return {
                  fields: {
                    ...prevState.fields,
                    [name]: {
                      ...prevState.fields[name],
                      value: nextProps.value[name],
                    },
                  },
                }
              })
            }
          }
        })
      } else if (!deepEqual(nextProps.initialValue, this.props.initialValue)) {
        Object.keys(nextProps.initialValue).forEach(name => {
          if (this.state.fields[name]) {
            this.resetField(name, null, nextProps.initialValue)
          }
        })
      }
    }

    componentDidMount() {
      this._isUnmounted = false
    }

    componentWillUnmount() {
      this._isUnmounted = true
    }

    cancelOnUnmount = promise => {
      return cancelPromise(promise, this._isUnmounted, { unmounted: true })
    }

    get pristine() {
      return Object.values(this.state.fields).every(field => field.pristine)
    }

    get touched() {
      return Object.values(this.state.fields).some(field => field.touched)
    }

    get valid() {
      return Object.values(this.state.fields).every(
        field => field.errors.length < 1
      )
    }

    get focused() {
      return Object.keys(this.state.fields).find(
        name => this.state.fields[name].focused
      )
    }

    get value() {
      return Object.keys(this.state.fields).reduce((value, name) => {
        value[name] = this.state.fields[name].value
        return value
      }, {})
    }

    get errors() {
      return Object.keys(this.state.fields).reduce((errors, name) => {
        if (this.state.fields[name].errors.length) {
          errors[name] = this.state.fields[name].errors
        }
        return errors
      }, {})
    }

    registerField = (name, fieldProps) => {
      this.validators[name] = getValidators(fieldProps)
      this.setState(prevState => {
        const prevField = prevState.fields[name]
        // recalculate initial values
        if (this.props.initialValue.hasOwnProperty(name)) {
          this.initialValue[name] = this.props.initialValue[name]
        } else {
          this.initialValue[name] = getInitialValue(prevField, fieldProps)
        }
        const value = this.props.value
          ? this.props.value[name]
          : this.initialValue[name]
        // field namespace is already registered.
        if (prevField) {
          return {
            fields: {
              ...prevState.fields,
              [name]: {
                ...prevField,
                // increment field count.
                count: prevField.count + 1,
                value: value,
              },
            },
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
                value: value,
              },
            },
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
                value: getDecrementValue(prevField, fieldProps),
                // TODO: run validation again?
              },
            },
          }
          // only one field registered to name.
        } else {
          delete this.validators[name]
          delete this.initialValue[name]
          return {
            fields: Object.keys(prevState.fields).reduce((fields, key) => {
              if (key !== name) {
                fields[key] = prevState.fields[key]
              }
              return fields
            }, {}),
          }
        }
      })
    }

    resetField = (name, fieldProps, initialValue) => {
      // cache prev computed state
      const prevPristine = this.pristine
      //
      this.setState(
        prevState => {
          const prevField = prevState.fields[name]
          if (initialValue.hasOwnProperty(name)) {
            this.initialValue[name] = initialValue[name]
          } else if (fieldProps) {
            this.initialValue[name] = getInitialValue(prevField, fieldProps)
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
                value: this.initialValue[name],
              },
            },
          }
        },
        () => {
          this.props.onChange(this.value)
          if (prevPristine !== this.pristine) {
            if (this.pristine) {
              this.props.onPristine()
            } else {
              this.props.onDirty()
            }
          }
        }
      )
    }

    changeField = (name, event) => {
      // cache prev computed state
      const prevPristine = this.pristine
      //
      this.setState(
        prevState => {
          const prevField = prevState.fields[name]
          const value = getNextValue(event, prevField)
          // TODO: ensure this is actually merging setStates
          if (prevField.errors.length) {
            this.validateField(name, value)
          }
          return {
            fields: {
              ...prevState.fields,
              [name]: {
                ...prevField,
                value: value,
                touched: true,
                validated: value === prevField.value,
                pristine: this.initialValue[name] === value,
              },
            },
          }
        },
        () => {
          this.props.onChange(this.value)
          if (prevPristine !== this.pristine) {
            if (this.pristine) {
              this.props.onPristine()
            } else {
              this.props.onDirty()
            }
          }
        }
      )
    }

    focusField = name => {
      this.setState(
        prevState => {
          return {
            fields: {
              ...prevState.fields,
              [name]: {
                ...prevState.fields[name],
                focused: true,
              },
            },
          }
        },
        () => {
          this.props.onFocus()
        }
      )
    }

    blurField = name => {
      this.setState(
        prevState => {
          return {
            fields: {
              ...prevState.fields,
              [name]: {
                ...prevState.fields[name],
                focused: false,
                touched: true,
              },
            },
          }
        },
        () => {
          if (!this.focused) {
            this.props.onBlur()
          }
        }
      )
      this.validateField(name, this.state.fields[name].value)
    }

    // TODO: better name (also unwarns field)
    warnField = (name, errors, validating) => {
      const prevValid = this.valid
      errors = errors.filter(err => err).map(err => err.message || err)
      this.setState(
        prevState => {
          return {
            fields: {
              ...prevState.fields,
              [name]: {
                ...prevState.fields[name],
                errors: errors,
                validating: validating,
                validated: !errors.length && !validating,
              },
            },
          }
        },
        () => {
          if (prevValid !== this.valid) {
            if (this.valid) {
              this.props.onValid()
            } else {
              this.props.onInvalid(this.errors)
            }
          }
        }
      )
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
        return (
          this.cancelOnUnmount(Promise.all(reflectErrors))
            // update field after errors resolve.
            .then(errors =>
              this.warnField(name, [...errors, ...syncErrors], false)
            )
        )
      } else {
        Promise.resolve()
      }
    }

    shouldFieldValidate = (name, nextValue) => {
      const { validated, pristine } = this.state.fields[name]
      if (!pristine && validated) return false
      return true
    }

    runFieldValidations = (name, value) => {
      return this.validators[name].reduce(
        (errors, validator) => {
          let err = validator(value, this.value)
          if (!err) {
            return errors
          } else if (typeof err === "string" || err instanceof Error) {
            errors.syncErrors.push(err)
          } else if (typeof err.then === "function") {
            errors.asyncErrors.push(err)
          } else {
            throw new Error(
              "validation must return a String, Error, or Promise"
            )
          }
          return errors
        },
        { syncErrors: [], asyncErrors: [] }
      )
    }

    validateForm = () => {
      // resolve if ALL fields are valid.
      // reject if ANY fields are invalid.
      return Promise.all(
        // run validation for every field.
        Object.keys(this.state.fields).reduce((validations, name) => {
          // each validation resolves when field was updated with latest error state.
          // should only fail to resolve if form unmounts.
          return [
            ...validations,
            this.validateField(name, this.state.fields[name].value),
          ]
        }, [])
      )
    }

    // form hooks

    handleSubmit = () => {
      if (this.valid) {
        const submission =
          this.props.onSubmit && this.props.onSubmit(this.value)
        const isAsync = submission && typeof submission.then === "function"
        if (isAsync) {
          this.setState({
            submitting: true,
            submitSuccess: null,
            submitFailure: null,
          })
        }
        // force submission into promise.
        const resultPromise = Promise.resolve(submission)
        this.cancelOnUnmount(resultPromise)
        return resultPromise
      } else {
        return Promise.reject(new Error("Form is invalid"))
      }
    }

    handleSubmitSuccess = result => {
      this.setState(
        {
          submitting: false,
          submitSuccess: true,
          submitFailure: null,
        },
        () => {
          this.props.onSubmitSuccess(result)
        }
      )
    }

    // TODO: better name for method (submission can be success and Form is simply unmounted)
    handleSubmitFailure = err => {
      if (!err.unmounted) {
        this.setState(
          {
            submitting: false,
            submitSuccess: false,
            submitFailure: err ? err.message || err : null,
          },
          () => {
            this.props.onSubmitFailure(err)
          }
        )
      }
    }

    submit = () => {
      return (
        Promise
          // validate form before submitting.
          .resolve(this.validateForm())
          .then(this.handleSubmit)
          .then(this.handleSubmitSuccess)
          .catch(this.handleSubmitFailure)
      )
    }

    reset = () => {
      Object.keys(this.state.fields).forEach(name =>
        this.resetField(name, null, this.props.initialValue)
      )
    }

    render() {
      // Strip out props that are handled internally.
      const {
        initialValue,
        onSubmit,
        onSubmitSuccess,
        onSubmitFailure,
        onChange,
        onPristine,
        onDirty,
        onFocus,
        onBlur,
        onValid,
        onInvalid,
        ...passProps
      } = this.props
      const {
        registerField,
        unregisterField,
        ...formProps
      } = this.getChildContext() // TODO: okay to call manually?
      return <ComposedComponent {...passProps} form={formProps} />
    }
  }
}
