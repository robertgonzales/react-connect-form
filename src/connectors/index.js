export connectField from "./connectField"
export connectForm from "./connectForm"
export connectSubmit from "./connectSubmit"
export connectReset from "./connectReset"

const Example1 = ({ signIn }) => {
  return (
    <Form onSubmit={signIn}>
      <Field name="name" component={TextInput} />
      <Field name="password" component={PasswordInput} />
      <Submit component={SubmitButton} />
    </Form>
  )
}

const Example2 = ({ signIn }) => {
  return <Form component={SignUpForm} />
}

const Example3 = ({ signIn }) => {
  return (
    <Form
      onSubmit={signIn}
      render={formProps => (
        <form>
          <Field name="name" component={TextInput} />
          <Field name="password" component={PasswordInput} />
          <Submit component={SubmitButton} />
        </form>
      )}
    />
  )
}

const Example4 = ({ signIn }) => {
  return (
    <Form onSubmit={signIn}>
      {formProps => (
        <form>
          <Field name="name" component={TextInput} />
          <Field name="password" component={PasswordInput} />
          <Submit component={SubmitButton} />
        </form>
      )}
    </Form>
  )
}
