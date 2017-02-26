import React, { Component, PropTypes } from 'react'

export default class Form extends Component {

  static displayName = 'Form'

  static propTypes = {
    onSubmit: PropTypes.func
  }

  static childContextTypes = {
    // TODO: custom name to avoid conflicts?
    form: PropTypes.object.isRequired
  }

  state = {
    fields: {}
  }

  getChildContext() {
    return {
      form: {
        registerField: this.registerField,
        unregisterField: this.unregisterField
      }
    }
  }

  registerField = (name) => {
    this.setState(prevState => {
      return {
        fields: {
          [name]: {
            value: null,
            touched: false,
            pristine: true
          }
        }
      }
    })
  }

  unregisterField = (name) => {
    this.setState(prevState => {
      // TODO: don't mutate
      delete prevState.fields[name]
      return prevState
    })
  }

  submit = () => {
    this.props.onSubmit(this.state.fields)
  }

  reset = () => {

  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <pre>
          <code>
            {JSON.stringify({
              "fields": this.state.fields,
            }, null, 2)}
          </code>
        </pre>
        {this.props.children}
      </form>
    )
  }

}
