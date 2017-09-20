import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { withForm } from "../connectors"

class Submit extends PureComponent {
  static displayName = "Submit"

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
    this.props.formActions.submit()
  }

  render() {
    const { render, component, formState, formActions, ...rest } = this.props
    const passProps = {
      onReset: formActions.reset,
      ...formState,
      ...rest,
    }
    if (typeof render === "function") {
      return render(passProps)
    }
    if (component === "button") {
      return React.createElement(component, {
        ...rest,
        onClick: this.handleClick,
      })
    }
    if (component) {
      return React.createElement(component, passProps)
    }
    return null
  }
}

export default withForm(Submit)
