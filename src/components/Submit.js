import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectSubmit } from "../connectors"

class Submit extends PureComponent {
  static displayName = "Submit"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.node,
  }

  static defaultProps = {
    component: "button",
  }

  render() {
    const { render, component, ...passProps } = this.props
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

export default connectSubmit(Submit)
