import React, { Component, PropTypes } from "react"

export default function connectReset(ComposedComponent) {
  return class extends Component {
    static displayName = `connectReset(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _formState: PropTypes.object.isRequired,
      _formActions: PropTypes.object.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.context._formState}
          onReset={this.context._formActions.reset}
        />
      )
    }
  }
}
