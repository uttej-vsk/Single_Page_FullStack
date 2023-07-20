import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem(
      "loggedInBlogUser"
    );
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedInBlogUser",
        JSON.stringify(user)
      );
      setUser(user);
      setUserName("");
      setPassword("");
    } catch (exception) {
      console.log("invalid credentials");
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
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

  return (
    <div>
      <h2>Welcome to Blogging Site</h2>

      {user === null && loginForm()}
      {user !== null && (
        <div>
          <h3>Blogs</h3>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
