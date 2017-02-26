import React, { Component, PropTypes } from 'react'

export default class Submit extends Component {

  static displayName = 'Submit'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) throw new Error('Submit must be inside Form')
  }

  handleClick = (e) => {
    this.context._form.submit(e)
  }

  render() {
    return (
      <button type="submit" onClick={this.handleClick}>
        {this.props.children}
      </button>
    )
  }

}
