import React, { Component } from "react"
import PropTypes from "prop-types"
import { deepEqual, getEventValue } from "../utils"

export default function connectField(ComposedComponent) {
  return class Field extends Component {
    static displayName = `connectField(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _formState: PropTypes.object.isRequired,
      _formActions: PropTypes.object.isRequired,
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
    }

    componentWillMount() {
      this.actions.registerField(this.props.name, this.props)
    }

    componentWillUnmount() {
      this.actions.unregisterField(this.props.name, this.props)
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.name !== this.props.name) {
        this.actions.unregisterField(this.props.name, this.props)
        this.actions.registerField(nextProps.name, nextProps)
      }
      if (
        !deepEqual(nextProps.initialValue, this.props.initialValue) ||
        nextProps.initialChecked !== this.props.initialChecked
      ) {
        this.actions.resetField(nextProps.name, nextProps)
      }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      const nextForm = nextContext._formState
      const nextField = nextForm.fields[nextProps.name]
      if (!this.field) return true
      return (
        !deepEqual(nextProps, this.props) ||
        !deepEqual(nextField, this.field) ||
        !deepEqual(nextForm, this.form)
      )
    }

    get actions() {
      return this.context._formActions
    }

    get form() {
      return this.context._formState
    }

    get field() {
      return this.form.fields[this.props.name]
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
      this.actions.changeField(this.props.name, value)
    }

    handleFocus = e => {
      if (typeof this.props.onFocus === "function") {
        this.props.onFocus(e)
      }
      this.actions.focusField(this.props.name)
    }

    handleBlur = e => {
      if (typeof this.props.onBlur === "function") {
        this.props.onBlur(e)
      }
      this.actions.blurField(this.props.name)
    }

    render() {
      if (!this.field) return null
      const {
        // strip out field props that are handled internally.
        initialValue,
        initialChecked,
        validators,
        ...passProps
      } = this.props
      return (
        <ComposedComponent
          {...passProps}
          {...this.field}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          checked={this.checked}
          value={this.value}
          form={this.form}
        />
      )
    }
  }
}
