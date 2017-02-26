import React, { Component, PropTypes } from 'react'
import { getValue } from '../utils'

export default class Field extends Component {

  static displayName = 'Field'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    validators: PropTypes.array,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  }

  static defaultProps = {
    validators: []
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) throw new Error('Field must be inside Form')
  }

  componentWillMount() {
    this.context._form.registerField(this.props.name, this.props.type, this.props.validators)
  }

  componentWillUnmount() {
    this.context._form.unregisterField(this.props.name)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.context._form.registerField(this.props.name)
      this.context._form.unregisterField(nextProps.name, nextProps.type, nextProps.validators)
    }
  }

  get field() {
    // TODO: handle non existence?
    return this.context._form.getField(this.props.name)
  }

  get checked() {
    if (this.props.type === 'radio') {
      return this.field.value === this.props.value
    } else if (this.props.type === 'checkbox') {
      if (Array.isArray(this.field.value)) {
        return this.field.value.indexOf(this.props.value) > -1
      } else {
        return !!this.field.value
      }
    }
  }

  get value() {
    if (this.props.type === 'radio' ||
        this.props.type === 'checkbox') {
      return this.props.value
    } else {
      return this.field.value
    }
  }

  get valid() {
    return this.field.errors.length < 1
  }

  handleChange = (e) => {
    const value = getValue(e, this.field.value, this.field.type)
    if (this.props.onChange && this.props.onChange(e) === false) return
    this.context._form.changeField(this.props.name, value)
  }

  handleFocus = (e) => {
    if (this.props.onFocus && this.props.onFocus(e) === false) return
    this.context._form.focusField(this.props.name)
  }

  handleBlur = (e) => {
    if (this.props.onBlur && this.props.onBlur(e) === false) return
    this.context._form.blurField(this.props.name)
  }

  render() {
    if (!this.field)
      return null

    const {
      pristine,
      focused,
      touched
    } = this.field

    return (
      <input
        name={this.props.name}
        type={this.props.type}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        checked={this.checked}
        value={this.value}
      />
    )
  }

}
