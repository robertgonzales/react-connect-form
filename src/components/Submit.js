import React, { Component, PropTypes } from 'react'

export default class Submit extends Component {

  static displayName = 'Submit'

  static contextTypes = {
    form: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    if (!context.form) throw new Error('Submit must be inside Form')
  }

  handleClick = (e) => {
    this.context.form.submit(e)
  }

  render() {
    return (
      <button type="submit" onClick={this.handleClick}>
        {this.props.children}
      </button>
    )
  }

}
