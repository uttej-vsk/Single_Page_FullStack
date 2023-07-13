const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  return blogs.reduce((curr, next) => {
    if (curr.likes > next.likes) {
      return curr;
    }
    return next;
  });
};

module.exports = {
  totalLikes,
  favoriteBlog,
};
