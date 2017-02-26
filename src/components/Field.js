import React, { Component, PropTypes } from 'react'

export default class Field extends Component {

  static displayName = 'Field'

  static contextTypes = {
    form: PropTypes.object.isRequired
  }

  static propTypes = {
    name: PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context)
    if (!context.form) throw new Error('Field must be inside Form')
  }

  componentWillMount() {
    this.context.form.registerField(this.props.name)
  }

  componentWillUnmount() {
    this.context.form.unregisterField(this.props.name)
  }

  render() {
    return (
      <input {...this.props} />
    )
  }

}
