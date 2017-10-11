import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  deepEqual,
  getNextValue,
  getValidators,
  getInitialValue,
  getDecrementValue,
} from "../utils"

export default class Form extends Component {
  static displayName = "Form"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.func,
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

  static contextTypes = {
    _formState: PropTypes.object,
  }

  static childContextTypes = {
    _formState: PropTypes.object.isRequired,
    _formActions: PropTypes.object.isRequired,
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
      _formState: {
        submitSuccess: this.state.submitSuccess,
        submitFailure: this.state.submitFailure,
        submitting: this.state.submitting,
        fields: this.state.fields,
        pristine: this.pristine,
        focused: this.focused,
        touched: this.touched,
        errors: this.errors,
        valid: this.valid,
        value: this.value,
      },
      _formActions: {
        unregisterField: this.unregisterField,
        registerField: this.registerField,
        changeField: this.changeField,
        resetField: this.resetField,
        focusField: this.focusField,
        blurField: this.blurField,
        submit: this.submit,
        reset: this.reset,
      },
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.value) {
      Object.keys(nextProps.value).forEach(name => {
        if (this.state.fields[name]) {
          if (nextProps.value[name] !== this.state.fields[name].value) {
            this.changeField(name, nextProps.value[name], true)
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

  cancelOnUnmount = async promise => {
    try {
      const result = await promise
      if (this._isUnmounted) throw new Error("Form is unmounted")
      return result
    } catch (err) {
      throw new Error(this._isUnmounted ? "Form is unmounted" : err)
    }
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
        if (initialValue && initialValue.hasOwnProperty(name)) {
          this.initialValue[name] = initialValue[name]
        } else if (fieldProps) {
          this.initialValue[name] = getInitialValue(prevField, fieldProps)
        }
        const value = this.props.value
          ? this.props.value[name]
          : this.initialValue[name]
        return {
          fields: {
            ...prevState.fields,
            [name]: {
              ...prevField,
              touched: false,
              pristine: true,
              validated: true,
              validating: false,
              value: value,
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

  // force: only used when in controlled mode (via this.props.value).
  // forces uncontrolled behavior (setState) instead of controlled behavior (onChange only)
  changeField = (name, event, force) => {
    // cache prev pristine computed state to compare in setState callback
    const prevPristine = this.pristine
    // perform updates for change event
    this.setState(
      prevState => {
        const prevField = prevState.fields[name]
        // value may need to be altered before updating
        // e.g. single checkbox value (true) vs multiple checkbox value ([1, 2])
        const value = getNextValue(event, prevField)
        // if controlled via value prop, don't set state — simply pass up value
        // responsibility moves to parent component to pass updated value prop
        if (this.props.value && !force) {
          this.props.onChange({ ...this.value, [name]: value })
          // abort setState
          return
        }
        // TODO: make sure sync validation merges set states.
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
        if (!this.props.value) {
          this.props.onChange(this.value)
        }
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
        this.props.onFocus(name)
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
        // defer callstack to be sure blur wasn't just
        // transfering focus to different field.
        setTimeout(() => {
          if (!this.focused) {
            this.props.onBlur()
          }
        }, 0)
      }
    )
    this.validateField(name, this.state.fields[name].value)
  }

  // TODO: better name (also unwarns field)
  warnField = (name, errors, validating) => {
    // cache prev valid computed state
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

  validateField = async (name, value) => {
    if (!this.shouldFieldValidate(name, value)) return
    const { syncErrors, asyncErrors } = this.runFieldValidations(name, value)
    const hasAsync = asyncErrors.length > 0
    // if no syncErrors, this will clear errors
    this.warnField(name, syncErrors, hasAsync)
    if (hasAsync) {
      // update field after first error resolves.
      const error = await this.cancelOnUnmount(Promise.race(asyncErrors))
      await this.warnField(name, [error, ...syncErrors], true)
      if (asyncErrors.length > 1) {
        // update field after all errors resolve.
        const errors = await this.cancelOnUnmount(Promise.all(asyncErrors))
        await this.warnField(name, [...errors, ...syncErrors], false)
      }
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
        } else if (typeof err.catch === "function") {
          // treat each error as successful resolve so we can handle all of them.
          const asyncErr = err.catch(err => err)
          errors.asyncErrors.push(asyncErr)
        } else {
          throw new Error("validation must return a String, Error, or Promise")
        }
        return errors
      },
      { syncErrors: [], asyncErrors: [] }
    )
  }

  validateAllFields = async () => {
    await Promise.all(
      Object.keys(this.state.fields).map(async name => {
        return await this.validateField(name, this.state.fields[name])
      })
    )
  }

  handleSubmission = async () => {
    if (this.valid) {
      const submission = this.props.onSubmit(this.value)
      await this.cancelOnUnmount(Promise.resolve(submission))
      this.setState(prevState => ({
        submitting: true,
        submitSuccess: null,
        submitFailure: null,
      }))
    } else {
      throw new Error("Form is invalid")
    }
  }

  handleSubmitSuccess = result => {
    this.setState(
      prevState => ({
        submitting: false,
        submitSuccess: true,
        submitFailure: null,
      }),
      () => this.props.onSubmitSuccess(result)
    )
  }

  handleSubmitFailure = err => {
    this.setState(
      prevState => ({
        submitting: false,
        submitSuccess: false,
        submitFailure: err ? err.message || err : null,
      }),
      () => this.props.onSubmitFailure(err)
    )
  }

  submit = async () => {
    try {
      await this.validateAllFields()
      const submission = await this.handleSubmission()
      this.handleSubmitSuccess(submission)
    } catch (err) {
      if (err && err.message !== "Form is unmounted") {
        this.handleSubmitFailure(err)
      }
    }
  }

  reset = () => {
    Object.keys(this.state.fields).forEach(name =>
      this.resetField(name, null, this.props.initialValue)
    )
  }

  render() {
    // strip out props that are handled internally.
    const {
      value,
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
      render,
      component,
      ...passProps
    } = this.props
    const { _formState } = this.getChildContext()

    if (render) {
      return render({ ...passProps, ..._formState })
    }

    if (component) {
      return React.createElement(component, { ...passProps, ..._formState })
    }

    // nested form
    if (this.context._formState) {
      const {
        count,
        errors,
        touched,
        focused,
        pristine,
        validated,
        validating,
        ...htmlProps
      } = passProps
      return <div {...htmlProps} />
    }

    return <form {...passProps} onSubmit={this.submit} />
  }
}
