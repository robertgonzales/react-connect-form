import React, { Component, PropTypes } from "react"

export default class Reset extends Component {
  static displayName = "Reset"

  static contextTypes = {
    _form: PropTypes.object.isRequired,
  }

  static defaultProps = {
    component: "button",
  }

  constructor(props, context) {
    super(props, context)
    if (!context._form) throw new Error("Reset must be inside Form")
  }

  handleClick = e => {
    this.context._form.reset()
  }

  render() {
    const { component, render, ...rest } = this.props
    const inputProps = {
      ...rest,
      type: "reset",
      onClick: this.handleClick,
    }
    if (typeof render === "function") {
      return render(inputProps)
    } else if (component === "button") {
      return React.createElement(component, inputProps)
    } else if (component) {
      return React.createElement(component, inputProps)
    } else {
      return null
    }
  }
}
