import React, { Component, PropTypes } from 'react'
import { update } from '../utils'

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

  validators = {}

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

  registerField = (name, validators) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: { $merge: {
          [name]: {
            errors: [],
            value: null,
            touched: false,
            focused: false,
            pristine: true,
          }
        }}
      })
    })
    this.validators[name] = validators || []
  }

  unregisterField = (name) => {
    this.setState(prevState => {
      return update(prevState, {
        fields: { $unset: [name] }
      })
    })
    delete this.validators[name]
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
    this.validateField(name, this.state.fields[name].value)
  }

  validateField = (name, value) => {
    //  TODO: shouldFieldValidate()
    // TODO: how should user build async errors? Promise.reject/resolve()
    const { syncErrors, asyncErrors } = this.runFieldValidations(name, value)
    const isAsync = asyncErrors.length > 0
    this.setState(prevState => {
      return update(prevState, {
        fields: {
          [name]: { $merge: {
            errors: syncErrors.filter(e => e).map(e => e.message || e)
          }}
        }
      })
    })
    if (isAsync) {
      Promise.all(asyncErrors.map(p => p.catch(e => e)))
        .then(errors => {
          console.log(errors)
          this.setState(prevState => {
             return update(prevState, {
               fields: {
                 [name]: { $merge: {
                   errors: [...errors, ...prevState.fields[name].errors].filter(e => e).map(e => e.message || e)
                 }}
               }
             })
           })
        })
    }
  }

  runFieldValidations = (name, value) => {
    return this.validators[name].reduce((errors, validator) => {
      let err = validator(value, this.values)
      if (!err) {
        return errors
      } else if (typeof err === 'string' || err instanceof Error) {
        errors.syncErrors.push(err)
      } else if (typeof err.then === 'function') {
        errors.asyncErrors.push(err)
      } else {
        throw new Error('validation must return a String, Error, or Promise')
      }
      return errors
    }, { syncErrors: [], asyncErrors: [] })
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
