const Blog = ({ blog }) => (
  <div>
    <p>
      <b>{blog.title} </b>by <i>{blog.author}</i>
    </p>
  </div>
);

export default Blog;
