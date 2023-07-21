const ErrorAlert = ({ errorNotification }) => {
  return errorNotification ? (
    <div>Username or password is wrong</div>
  ) : null;
};

export default ErrorAlert;
