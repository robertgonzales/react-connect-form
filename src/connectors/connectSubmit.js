import React, { Component, PropTypes } from "react"

export default function connectSubmit(ComposedComponent) {
  return class extends Component {
    static displayName = `connectSubmit(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _form: PropTypes.object.isRequired,
    }

    static propTypes = {
      type: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }

    static defaultProps = {
      type: "submit",
    }

    constructor(props, context) {
      super(props, context)
      if (!context._form) {
        throw new Error("Submit must be inside Form")
      }
    }

    handleClick = e => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault()
      }
      if (typeof this.props.onClick === "function") {
        this.props.onClick(e)
      }
      this.context._form.submit(e)
    }

    render() {
      const {
        // Strip out props that are handled internally.
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
