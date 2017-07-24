import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectReset } from "../connectors"

class Reset extends PureComponent {
  static displayName = "Reset"

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
    this.props.onReset()
  }

  render() {
    const { component, render, ...passProps } = this.props
    if (typeof render === "function") {
      return render(passProps)
    } else if (component === "button") {
      // strip out invalid html props
      const {
        submitSuccess,
        submitFailure,
        submitting,
        pristine,
        focused,
        touched,
        errors,
        valid,
        value,
        fields,
        onReset,
        ...htmlProps
      } = passProps
      const onClick = this.handleClick
      return React.createElement(component, { ...htmlProps, onClick })
    } else if (component) {
      return React.createElement(component, passProps)
    } else {
      return null
    }
  }
}

export default connectReset(Reset)
