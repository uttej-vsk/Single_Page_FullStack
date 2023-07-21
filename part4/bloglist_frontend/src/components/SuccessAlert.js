const SuccessAlert = ({ successNotification, blogs }) => {
  const latestBlog = blogs[blogs.length - 1];
  return successNotification ? (
    <div>
      {latestBlog.title} added by {latestBlog.author}
    </div>
  ) : null;
};

export default SuccessAlert;
