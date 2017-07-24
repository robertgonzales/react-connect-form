import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connectForm } from "../connectors"

class Form extends PureComponent {
  static displayName = "Form"

  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    noValidate: PropTypes.bool,
    autoComplete: PropTypes.oneOf(["on", "off"]),
  }

  static defaultProps = {
    component: "form",
    noValidate: true,
  }

  handleSubmit = e => {
    // Prevent default <form> onSubmit behavior. Use <Submit> instead.
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault()
    }
  }

  render() {
    const { render, component, ...passProps } = this.props
    if (typeof render === "function") {
      return render(passProps)
    } else if (typeof component === "string") {
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
        // extra props for <Field component={Form} />
        // TODO: strip out elsewhere
        nested,
        count,
        validated,
        validating,
        ...htmlProps
      } = passProps
      const onSubmit = this.handleSubmit
      const element = nested ? "div" : component
      return React.createElement(element, { ...htmlProps, onSubmit })
    } else if (component) {
      return React.createElement(component, passProps)
    } else {
      return null
    }
  }
}

export default connectForm(Form)
