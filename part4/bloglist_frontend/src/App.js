import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import jwt_decode from "jwt-decode";
import LoginForm from "./components/LoginForm";
import AddBlog from "./components/AddBlog";
import SuccessAlert from "./components/SuccessAlert";
import ErrorAlert from "./components/ErrorAlert";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newLikes, setNewLikes] = useState("");
  const [successNotification, setSuccessNotification] =
    useState(false);
  const [errorNotification, setErrorNotification] = useState(false);
  const [loginFormVisible, setLoginFormVisible] = useState(false);

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
      setErrorNotification(false);
    } catch (exception) {
      console.log("invalid credentials");
      setErrorNotification(true);
      setTimeout(() => {
        setErrorNotification(false);
      }, 3000);
    }
  };

  const handleAddBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        likes: parseInt(newLikes),
        userId: JSON.parse(window.localStorage.getItem("userId")),
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

      setSuccessNotification(true);
      setTimeout(() => {
        setSuccessNotification((prevState) => !prevState);
      }, 3000);
    } catch (error) {
      console.log("Error adding blog:", error.message);
    }
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

  const toggleShowLoginOptions = () => {
    setLoginFormVisible((prevState) => !prevState);
  };

  return (
    <div>
      <h2>Welcome to Book Store</h2>

      {user === null ? (
        <>
          <ErrorAlert errorNotification={errorNotification} />

          <div
            style={{ display: loginFormVisible ? "none" : "block" }}
          >
            <h4>Continue with Login</h4>
            <button onClick={toggleShowLoginOptions}>Log In </button>
          </div>

          <div
            style={{ display: loginFormVisible ? "block" : "none" }}
          >
            <LoginForm
              onLogin={handleLogin}
              username={username}
              password={password}
              handleUserNameChange={({ target }) =>
                setUserName(target.value)
              }
              handlePasswordChange={({ target }) =>
                setPassword(target.value)
              }
            />
            <button onClick={toggleShowLoginOptions}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          {existingUser()}
          <SuccessAlert
            successNotification={successNotification}
            blogs={blogs}
          />
          <Blog blogs={blogs} />

          <AddBlog
            onAddBlog={handleAddBlog}
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
            newLikes={newLikes}
            setNewTitle={setNewTitle}
            setNewAuthor={setNewAuthor}
            setNewUrl={setNewUrl}
            setNewLikes={setNewLikes}
          />
        </>
      )}
    </div>
  );
};

export default App;
