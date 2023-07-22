const LoginForm = (props) => {
  return (
    <form onSubmit={props.onLogin}>
      <div>
        username{" "}
        <input
          type='text'
          value={props.username}
          name='username'
          autoComplete='username'
          onChange={props.handleUserNameChange}
        />
      </div>

      <div>
        Password {""}
        <input
          type='password'
          value={props.password}
          name='password'
          autoComplete='current-password'
          onChange={props.handlePasswordChange}
        />
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default LoginForm;
