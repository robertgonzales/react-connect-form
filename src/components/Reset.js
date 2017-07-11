import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectReset } from "../connectors"

class Reset extends PureComponent {
  static displayName = "Reset"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.node,
  }

  static defaultProps = {
    component: "button",
  }

  render() {
    const { component, render, ...passProps } = this.props
    if (typeof render === "function") {
      return render(passProps)
    } else if (component === "button") {
      return React.createElement(component, passProps)
    } else if (component) {
      return React.createElement(component, passProps)
    } else {
      return null
    }
  }
}

export default connectReset(Reset)
