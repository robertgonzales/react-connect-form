import React, { Component, PropTypes } from "react"

export default function connectSubmit(ComposedComponent) {
  return class extends Component {
    static displayName = `connectSubmit(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _formState: PropTypes.object.isRequired,
      _formActions: PropTypes.object.isRequired,
    }

    static propTypes = {
      type: PropTypes.string.isRequired,
    }

    static defaultProps = {
      type: "submit",
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.context._formState}
          onSubmit={this.context._formActions.submit}
        />
      )
    }
  }
}
