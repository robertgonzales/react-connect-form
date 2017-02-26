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

  get values() {
     return Object.keys(this.state.fields).reduce((values, name) => {
       if (!this.state.fields[name].value) return values
       return { ...values, [name]: this.state.fields[name].value }
     }, {})
   }

   get pristine() {
     return Object.keys(this.state.fields).reduce((pristine, name) => {
       return pristine ? this.state.fields[name].pristine : false
     }, true)
   }

   get touched() {
     return Object.keys(this.state.fields).reduce((touched, name) => {
       return touched ? true : this.state.fields[name].touched
     }, false)
   }

   get focused() {
     return Object.keys(this.state.fields).reduce((focused, name) => {
       return focused ? focused : this.state.fields[name].focused ? name : null
     }, null)
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
              "touched": this.touched,
              "pristine": this.pristine,
              "focused": this.focused,
              "fields": this.state.fields,
              "values": this.values,
            }, null, 2)}
          </code>
        </pre>
        {this.props.children}
      </form>
    )
  }

}
