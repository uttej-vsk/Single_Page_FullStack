import { useState } from "react";

const ToggleForm = (props) => {
  const [loginFormVisible, setLoginFormVisible] = useState(false);

  const showWhenHidden = { display: loginFormVisible ? "none" : "" };
  const showWhenVisible = { display: loginFormVisible ? "" : "none" };

  const toggleVisibility = () => {
    setLoginFormVisible(!loginFormVisible);
  };

  return (
    <div>
      <div style={showWhenHidden}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
};

export default ToggleForm;
