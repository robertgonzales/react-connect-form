import React, { Component, PropTypes } from 'react'

export default class Submit extends Component {
  static displayName = 'Submit'

  static contextTypes = {
    _form: PropTypes.object.isRequired
  }

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onClick: PropTypes.func
  }

  static defaultProps = {
    component: 'button'
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) throw new Error('Submit must be inside Form')
  }

  handleClick = e => {
    this.context._form.submit(e)
  }

  render() {
    const { component, render, ...rest } = this.props
    const {
      submitSuccess,
      submitFailure,
      submitting,
      pristine,
      valid
    } = this.context._form
    const inputProps = {
      ...rest,
      type: 'submit',
      onClick: this.handleClick,
      disabled: submitting || pristine
    }
    const passProps = {
      ...inputProps,
      submitSuccess,
      submitFailure,
      submitting,
      pristine,
      valid
    }
    if (component) {
      if (component === 'button') {
        return React.createElement(component, inputProps)
      } else {
        return React.createElement(component, passProps)
      }
    } else if (typeof render === 'function') {
      return render(passProps)
    } else {
      return null
    }
  }
}
