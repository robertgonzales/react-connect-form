import React, { Component, PropTypes } from 'react'

export default class Debug extends Component {
  static displayName = 'Debug'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    if (!context._form) throw new Error('Debug must be inside Form')
  }

  render () {
    const { fields, ...rest } = this.context._form
    return (
      <pre>
        <code>
          {JSON.stringify(rest, null, 1)}
        </code>
        {this.props.fields && (
          <code>
            {JSON.stringify(fields, null, 1)}
          </code>
        )}
      </pre>
    )
  }
}
