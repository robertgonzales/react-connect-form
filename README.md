```jsx
import { Form, Field, Submit, validators } from 'react-controlled-form'

const { isMinLength, isEmail } = validators
const isUniqueEmail = (value) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (value === 'robert@gmail.com') {
        resolve("Email is already taken")
      } else {
        resolve()
      }
    }, 500)
  })
}

<Form>
  <Field
    name="first_name"
    type="text"
    placeholder="First name"
    validators={[isMinLength(2)]}
  />
  <Field
    name="last_name"
    type="text"
    placeholder="Last name"
    validators={[isMinLength(2)]}
  />
  <Field
    name="email"
    type="text"
    placeholder="Email"
    validators={[isEmail, isUniqueEmail]}
  />
  <Submit>Submit</Submit>
</Form>
```
