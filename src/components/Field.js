import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectField } from "../connectors"

class Field extends PureComponent {
  static displayName = "Field"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.node,
  }

  static defaultProps = {
    component: "input",
  }

  render() {
    const { render, component, ...rest } = this.props
    if (typeof render === "function") {
      return render(rest)
    } else if (typeof component === "string") {
      return React.createElement(component, rest)
    } else if (component) {
      return React.createElement(component, rest)
    } else {
      return null
    }
  }
}

export default connectField(Field)
