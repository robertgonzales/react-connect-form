import React, { Component, PropTypes } from "react"
import { deepEqual, getEventValue } from "../utils"

export default function connectField(ComposedComponent) {
  return class Field extends Component {
    static displayName = `connectField(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _form: PropTypes.object.isRequired,
    }

    static propTypes = {
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      validators: PropTypes.array,
      onChange: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
    }

    static defaultProps = {
      validators: [],
      type: "text",
    }

    constructor(props, context) {
      super(props, context)
      if (!context._form) {
        throw new Error("Field must be inside Form")
      }
    }

    componentWillMount() {
      this.context._form.registerField(this.props.name, this.props)
    }

    componentWillUnmount() {
      this.context._form.unregisterField(this.props.name, this.props)
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.name !== this.props.name) {
        this.context._form.unregisterField(this.props.name, this.props)
        this.context._form.registerField(nextProps.name, nextProps)
      }
      if (
        !deepEqual(nextProps.initialValue, this.props.initialValue) ||
        nextProps.initialChecked !== this.props.initialChecked
      ) {
        this.context._form.resetField(nextProps.name, nextProps)
      }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      const nextField = nextContext._form.fields[nextProps.name]
      const nextForm = nextContext._form
      if (!this.field) return true
      return (
        Object.keys(nextProps).some(k => nextProps[k] !== this.props[k]) ||
        Object.keys(nextField).some(k => nextField[k] !== this.field[k]) ||
        Object.keys(nextForm).some(k => nextForm[k] !== this.context._form[k])
      )
    }

    get field() {
      return this.context._form.fields[this.props.name]
    }

    get value() {
      if (this.props.type === "radio" || this.props.type === "checkbox") {
        if (this.props.value === undefined) {
          return true
        }
        return this.props.value
      }
      if (
        this.props.type === "text" ||
        this.props.type === "email" ||
        this.props.type === "password"
      ) {
        return this.field.value || ""
      }
      return this.field.value
    }

    get checked() {
      if (this.props.type === "radio" || this.props.type === "checkbox") {
        if (Array.isArray(this.field.value)) {
          return this.field.value.indexOf(this.value) > -1
        } else {
          return this.field.value === this.value
        }
      }
    }

    handleChange = e => {
      const value = getEventValue(e, this.props)
      if (typeof this.props.onChange === "function") {
        this.props.onChange(e)
      }
      this.context._form.changeField(this.props.name, value)
    }

    handleFocus = e => {
      if (typeof this.props.onFocus === "function") {
        this.props.onFocus(e)
      }
      this.context._form.focusField(this.props.name)
    }

    handleBlur = e => {
      if (typeof this.props.onBlur === "function") {
        this.props.onBlur(e)
      }
      this.context._form.blurField(this.props.name)
    }

    render() {
      if (!this.field) return null
      // strip out field props that are handled internally.
      const {
        initialValue,
        initialChecked,
        validators,
        ...passProps
      } = this.props
      // strip out private form handlers.
      const {
        unregisterField,
        registerField,
        ...formProps
      } = this.context._form
      return (
        <ComposedComponent
          {...passProps}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          checked={this.checked}
          value={this.value}
          field={this.field}
          form={formProps}
        />
      )
    }
  }
}
