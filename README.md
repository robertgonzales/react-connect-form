# react-connect-form
Controlled forms for React.

## Getting Started

- [Examples]()
  - [Basic Form]()
  - [Validation]()
  - [Async Validation]()
  - [Conditional Fields]()
  - [Stepped Forms]()
  - [Nested Forms]()
- [API]()
  - [Components]()
    - [\<Form />]()
    - [\<Field />]()
    - [\<Submit />]()
    - [\<Reset />]()
    - [\<Debug />]()
  - [Connectors]()
    - [createForm]()
    - [createField]()
    - [withForm]()
  - [Helpers]()
    - [validators]()

## Examples

### Basic
```jsx
import { Form, Field, Submit } from "react-connect-form"

const UserForm = () => (
  <Form onSubmit={console.log}>
    <Field
      name="first_name"
      type="text"
      placeholder="First name"
    />
    <Field
      name="last_name"
      type="text"
      placeholder="Last name"
    />
    <Field
      name="email"
      type="text"
      placeholder="Email"
    />
    <Submit>Submit</Submit>
  </Form>
)
```

### Validation
```jsx
import { Form, Field, Submit } from "react-connect-form"
import regex from 'regex-email'

function isEmail(value) {
  if (!regex.test(value)) {
    return "Please enter a valid email address"
  }
}

const EmailForm = () => (
  <Form onSubmit={console.log}>
    <Field
      name="email"
      type="text"
      placeholder="Email"
      validators={[isEmail]}
    />
    <Submit>Submit</Submit>
  </Form>
)
```

### Async Validation
```jsx
import { Form, Field, Submit, validators } from "react-connect-form"
const { isEmail } = validators

function isUniqueEmail(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === "robert@gmail.com") {
        reject("Email is already in use")
      } else {
        resolve()
      }
    }, 1000)
  })
}

const EmailForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="email"
      type="text"
      placeholder="Email"
      validators={[isEmail, isUniqueEmail]}
    />
    <Submit>Submit</Submit>
  </Form>
)
```

## API

### `<Form />`
### `<Field />`
### `<Submit />`

### `formState`
### `formActions`

### `connectForm`
### `connectField`
### `withForm`

### `validators`
