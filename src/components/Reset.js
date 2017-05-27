import React, { Component, PropTypes } from 'react'

export default class Reset extends Component {
  static displayName = 'Reset'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) throw new Error('Reset must be inside Form')
  }

  handleClick = e => {
    this.context._form.reset()
  }

  render() {
    return (
      <button type="reset" onClick={this.handleClick}>
        {this.props.children}
      </button>
    )
  }
}
