import React, { Component, PropTypes } from 'react'

export default class Field extends Component {

  static displayName = 'Field'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  static propTypes = {
    name: PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) throw new Error('Field must be inside Form')
  }

  componentWillMount() {
    this.context._form.registerField(this.props.name, this.props.validators)
  }

  componentWillUnmount() {
    this.context._form.unregisterField(this.props.name)
  }

  get field() {
    // TODO: handle non existence?
    return this.context._form.getField(this.props.name)
  }

  handleChange = (e) => {
    this.context._form.changeField(this.props.name, e.target.value)
  }

  handleFocus = (e) => {
    this.context._form.focusField(this.props.name)
  }

  handleBlur = (e) => {
    this.context._form.blurField(this.props.name)
  }

  render() {
    if (!this.field) {
      return null
    }
    const {
      pristine,
      focused,
      touched,
      value,
    } = this.field

    return (
      <input {...this.props}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        value={value}
      />
    )
  }

}
