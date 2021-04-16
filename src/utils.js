export const isPostExistInFeed = (post, feed) => feed.posts.find((p) => p.id === post.id);

export const findAddedPosts = (currenFeed, newFeed) => {
  const addedPosts = newFeed.posts.filter((post) => !isPostExistInFeed(post, currenFeed));

  return addedPosts;
};
