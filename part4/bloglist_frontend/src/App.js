import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import jwt_decode from "jwt-decode";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newLikes, setNewLikes] = useState();

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem(
      "loggedInBlogUser"
    );
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      const currentTime = Math.floor(Date.now() / 1000);
      if (user.exp < currentTime) {
        window.localStorage.removeItem("loggedInBlogUser");
        setUser(null);
        blogService.setToken(null);
      } else {
        setUser(user);
        blogService.setToken(user.token);
      }
    }
  }, []);

  useEffect(() => {
    console.log("useEffect triggered with user:", user);
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        console.log("Fetched blogs:", blogs);
        setBlogs(blogs);
      } catch (error) {
        console.log("Error fetching blogs:", error.message);
      }
    };

    if (user && user.token) {
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Current time:", currentTime);
      if (user.exp > currentTime) {
        console.log("Fetching blogs...");
        fetchBlogs();
      }
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      const expirationTime = jwt_decode(user.token).exp;
      const userId = jwt_decode(user.token).id; // Get the userId from the token

      console.log("Logged in user:", user);
      console.log("user id", userId);
      console.log("Expiration time:", expirationTime);

      window.localStorage.setItem(
        "loggedInBlogUser",
        JSON.stringify({
          ...user,
          exp: expirationTime,
        })
      );
      window.localStorage.setItem(
        "userId",
        JSON.stringify("userId", userId)
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

  const handleAddBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        likes: newLikes,
        user: JSON.parse(window.localStorage.getItem("userId")),
      };

      // Send the newBlog data to the backend to create the blog
      const addedBlogResponse = await blogService.addBlog(newBlog);
      console.log("from frontend:", addedBlogResponse);

      // Assuming the backend returns the created blog, you can update the blogs state
      // to display the new blog in the list immediately
      setBlogs([...blogs, addedBlogResponse]);
      console.log("from frontend", blogs);

      // Clear the form fields
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
      setNewLikes(0);
    } catch (error) {
      console.log("Error adding blog:", error.message);
    }
  };

  const addBlog = () => {
    return (
      <form onSubmit={handleAddBlog}>
        <div>
          Title{" "}
          <input
            type='text'
            name='title'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div>
          Author{" "}
          <input
            type='text'
            name='author'
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        </div>
        <div>
          URL{" "}
          <textarea
            name='url'
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>
        <div>
          likes{" "}
          <textarea
            name='likes'
            value={newLikes}
            onChange={(e) => setNewLikes(e.target.value)}
          />
        </div>

        <button type='submit'>Add Blog</button>
      </form>
    );
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log("logging out");
    window.localStorage.removeItem("loggedInBlogUser");
    window.localStorage.removeItem("userId"); // Remove the userId from local storage
    setUser(null);
    blogService.setToken(null);
  };

  const existingUser = () => {
    return (
      <div>
        Welcome, {user.name}
        <button type='submit' onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2>Welcome to Blogging Site</h2>

      {user === null && loginForm()}
      {user !== null && existingUser()}
      {user !== null && (
        <div>
          <h3>Blogs</h3>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}

          <h1>Add a new blog</h1>
          {user !== null && addBlog()}
        </div>
      )}
    </div>
  );
};

export default App;
