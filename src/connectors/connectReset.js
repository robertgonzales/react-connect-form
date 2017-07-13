import React, { Component, PropTypes } from "react"

export default function connectReset(ComposedComponent) {
  return class extends Component {
    static displayName = `connectReset(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _form: PropTypes.object.isRequired,
    }

    constructor(props, context) {
      super(props, context)
      if (!context._form) {
        throw new Error("Reset must be inside Form")
      }
    }

    handleClick = e => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault()
      }
      if (typeof this.props.onClick === "function") {
        this.props.onClick(e)
      }
      this.context._form.reset()
    }

    render() {
      const {
        // strip out form handlers that should only be used internally
        registerField,
        unregisterField,
        ...formProps
      } = this.context._form
      return (
        <ComposedComponent
          {...this.props}
          form={formProps}
          onClick={this.handleClick}
        />
      )
    }
  }
}
