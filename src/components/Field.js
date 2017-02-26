import React, { Component, PropTypes } from 'react'

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
    this.context._form.registerField(this.props.name, this.props.validators)
  }

  componentWillUnmount() {
    this.context._form.unregisterField(this.props.name)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.context._form.registerField(this.props.name)
      this.context._form.unregisterField(nextProps.name, this.props.validators)
    }
  }

  get field() {
    // TODO: handle non existence?
    return this.context._form.getField(this.props.name)
  }

  handleChange = (e) => {
    if (this.props.onChange && this.props.onChange(e) === false) return
    this.context._form.changeField(this.props.name, e.target.value)
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
