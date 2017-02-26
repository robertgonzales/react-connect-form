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
    this.context._form.registerField(this.props.name)
  }

  componentWillUnmount() {
    this.context._form.unregisterField(this.props.name)
  }

  handleChange = (e) => {
    this.context._form.changeField(this.props.name, e.target.value)
  }

  render() {
    return (
      <input {...this.props} onChange={this.handleChange} />
    )
  }

}
