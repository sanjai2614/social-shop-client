import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "../services/post.service.js";

const useSavedPosts = () => {
  const query = useQuery({
    queryKey: ["saved-posts"],
    queryFn: getSavedPosts,
  });

  const response = query.data;

  const savedPosts =
    response?.data?.savedPosts ??
    response?.savedPosts ??
    [];

  const posts = savedPosts
    .filter((item) => item.post)
    .map((item) => ({
      ...item.post,
      isSaved: true,
    }));

  return {
    ...query,
    posts,
  };
};

export default useSavedPosts;