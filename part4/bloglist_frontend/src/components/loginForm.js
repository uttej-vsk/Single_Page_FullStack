const LoginForm = ({ ...props }) => {
  const { onLogin, username, password, setPassword, setUserName } =
    props;
  return (
    <form onSubmit={onLogin}>
      <div>
        username{" "}
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUserName(target.value)}
        />
      </div>

      <div>
        Password {""}
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default LoginForm;
