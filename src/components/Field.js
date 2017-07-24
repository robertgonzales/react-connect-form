import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectField } from "../connectors"

class Field extends PureComponent {
  static displayName = "Field"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }

  static defaultProps = {
    component: "input",
  }

  render() {
    const { render, component, ...passProps } = this.props
    if (typeof render === "function") {
      return render(passProps)
    } else if (typeof component === "string") {
      const {
        // strip out invalid html props
        form,
        count,
        errors,
        touched,
        focused,
        pristine,
        validated,
        validating,
        ...htmlProps
      } = passProps
      return React.createElement(component, htmlProps)
    } else if (component) {
      return React.createElement(component, passProps)
    } else {
      return null
    }
  }
}

export default connectField(Field)
