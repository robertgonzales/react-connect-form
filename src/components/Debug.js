import React, { Component } from "react"
import PropTypes from "prop-types"
import { withForm } from "../connectors"
import { deepEqual } from "../utils"

const getChanges = (prev, next) => {
  if (!prev) {
    return
  }
  if (!Object.keys(prev).length) {
    return
  }
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

class Debug extends Component {
  static displayName = "Debug"

  static propTypes = {
    name: PropTypes.string,
    fields: PropTypes.bool,
    render: PropTypes.bool,
    log: PropTypes.bool,
  }

  static defaultProps = {
    render: true,
  }

  shouldComponentUpdate(nextProps) {
    return (
      !deepEqual(nextProps, this.props) ||
      !deepEqual(nextProps.formState, this.props.formState)
    )
  }

  componentDidUpdate(prevProps) {
    const { fields: prevFields, ...prevForm } = prevProps.formState
    const { fields: nextFields, ...nextForm } = this.props.formState
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
    const { fields, ...rest } = this.props.formState
    if (!this.props.render) {
      return null
    }
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
}

export default withForm(Debug)
