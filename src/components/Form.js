import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectForm } from "../connectors"

class Form extends PureComponent {
  static displayName = "Form"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.node,
    noValidate: PropTypes.bool,
    autoComplete: PropTypes.oneOf(["on", "off"]),
  }

  static defaultProps = {
    component: "form",
    noValidate: true,
  }

  render() {
    const { render, component, ...passProps } = this.props
    if (typeof render === "function") {
      return render(passProps)
    } else if (typeof component === "string") {
      const { form, ...htmlProps } = passProps
      return React.createElement(component, htmlProps)
    } else if (component) {
      return React.createElement(component, passProps)
    } else {
      return null
    }
  }
}

export default connectForm(Form)
