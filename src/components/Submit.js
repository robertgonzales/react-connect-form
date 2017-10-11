import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Submit extends Component {
  static displayName = "Submit"

  static contextTypes = {
    _formState: PropTypes.object.isRequired,
    _formActions: PropTypes.object.isRequired,
  }

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }

  static defaultProps = {
    component: "button",
  }

  handleClick = e => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault()
    }

    if (typeof this.props.onClick === "function") {
      this.props.onClick(e)
    }

    this.context._formActions.submit()
  }

  render() {
    const { render, component, ...rest } = this.props
    const props = {
      ...rest,
      ...this.context._formState,
      onSubmit: this.context._formActions.submit,
    }

    if (typeof render === "function") {
      return render(props)
    }

    if (typeof component === "function") {
      return React.createElement(component, props)
    }

    if (typeof component === "string") {
      return React.createElement(component, {
        ...rest,
        onClick: this.handleClick,
      })
    }

    return null
  }
}
