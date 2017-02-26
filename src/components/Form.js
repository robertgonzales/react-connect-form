import React, { Component, PropTypes } from 'react'
import update from 'immutability-helper'

update.extend('$unset', (keysToRemove, original) => {
  let copy = Object.assign({}, original)
  for (const key of keysToRemove) {
    delete copy[key]
  }
  return copy
})

export default class Form extends Component {

  static displayName = 'Form'

  static propTypes = {
    onSubmit: PropTypes.func
  }

  static childContextTypes = {
    _form: PropTypes.object.isRequired
  }

  state = {
    fields: {}
  }

  getChildContext() {
    return {
      _form: {
        changeField: this.changeField,
        registerField: this.registerField,
        unregisterField: this.unregisterField
      }
    }
  }

  registerField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: { $merge: {
          [name]: {
            value: null,
            touched: false,
            pristine: true
          }
        }}
      })
    })
  }

  unregisterField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: { $unset: [name] }
      })
    })
  }

  changeField = (name, value) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            value: value,
            touched: true,
            pristine: false
          }}
        }
      })
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
