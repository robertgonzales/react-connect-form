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
        unregisterField: this.unregisterField,
        registerField: this.registerField,
        changeField: this.changeField,
        focusField: this.focusField,
        blurField: this.blurField,
        getField: this.getField
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
            focused: false,
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

  getField = (name) => {
    return this.state.fields[name]
  }

  changeField = (name, value) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            value: value,
            pristine: false
          }}
        }
      })
    })
  }

  focusField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: {
            focused: { $set: true }
          }
        }
      })
    })
  }

  blurField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            focused: false,
            touched: true
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
