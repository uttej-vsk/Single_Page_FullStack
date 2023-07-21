const AddBlog = ({ ...props }) => {
  const {
    newTitle,
    newAuthor,
    newLikes,
    newUrl,
    onAddBlog,
    setNewTitle,
    setNewAuthor,
    setNewLikes,
    setNewUrl,
  } = props;
  return (
    <form onSubmit={onAddBlog}>
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
        <input
          name='likes'
          value={newLikes}
          onChange={(e) => setNewLikes(e.target.value)}
        />
      </div>

      <button type='submit'>Add Blog</button>
    </form>
  );
};

export default AddBlog;
