const Blog = ({ blogs }) => (
  <>
    <div>
      <ol>
        {blogs.map((blogItem) => (
          <li key={blogItem.id}>
            {blogItem.title} by <i>{blogItem.author}</i>
          </li>
        ))}
      </ol>
    </div>
  </>
);

export default Blog;
