import React, { Component, PropTypes } from "react"
import { deepEqual } from "../utils"

const getChanges = (prev, next) => {
  if (!prev) return
  if (!Object.keys(prev).length) return
  return Object.keys(prev)
    .reduce((changes, key) => {
      if (prev[key] !== next[key]) {
        if (Array.isArray(prev[key])) {
          if (
            prev[key].length !== next[key].length ||
            prev[key].some((item, index) => item !== next[key][index])
          ) {
            changes.push(
              `\t${key}: ${JSON.stringify(prev[key])} => ${JSON.stringify(
                next[key]
              )}`
            )
          }
        } else if (typeof prev[key] === "object") {
          const childChanges = getChanges(prev[key], next[key])
          if (childChanges) {
            changes.push(key + "\n" + childChanges)
          }
        } else {
          changes.push(
            `\t${key}: ${JSON.stringify(prev[key])} => ${JSON.stringify(
              next[key]
            )}`
          )
        }
      }
      return changes
    }, [])
    .join("\n")
}

export default class Debug extends Component {
  static displayName = "Debug"

  static contextTypes = {
    _formState: PropTypes.object.isRequired,
    _formActions: PropTypes.object.isRequired,
  }

  static propTypes = {
    name: PropTypes.string,
    fields: PropTypes.bool,
    render: PropTypes.bool,
    log: PropTypes.bool,
  }

  static defaultProps = {
    render: true,
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !deepEqual(nextContext, this.props) ||
      !deepEqual(nextContext._formState, this.context._formState)
    )
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { fields: prevFields, ...prevForm } = prevContext._formState
    const { fields: nextFields, ...nextForm } = this.context._formState

    if (this.props.log) {
      if (this.props.name) {
        console.log(getChanges(prevFields[name], nextFields[name]))
      } else if (this.props.fields) {
        console.log(getChanges(prevFields, nextFields))
      } else {
        console.log(getChanges(prevForm, nextForm))
      }
    }
  }

  render() {
    const { fields, ...rest } = this.context._formState

    if (this.props.render) {
      return (
        <pre>
          <code>
            {this.props.name ? (
              JSON.stringify(fields[name], null, 2)
            ) : this.props.field ? (
              JSON.stringify(fields, null, 2)
            ) : (
              JSON.stringify(rest, null, 2)
            )}
          </code>
        </pre>
      )
    }

    return null
  }
}
