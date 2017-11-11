import React, { Component } from "react"
import PropTypes from "prop-types"

export default function withForm(ComposedComponent) {
  return class extends Component {
    static displayName = `withForm(${ComposedComponent.displayName || ""})`

    static contextTypes = {
      _formState: PropTypes.object.isRequired,
      _formActions: PropTypes.object.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          formState={this.context._formState}
          formActions={this.context._formActions}
        />
      )
    }
  }
}
