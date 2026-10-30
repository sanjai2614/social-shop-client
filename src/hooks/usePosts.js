
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
} from "../services/post.service.js";

const usePosts = (params = {}) => {
  const queryClient = useQueryClient();

  // Fetch posts
  const query = useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
    staleTime: 30_000,
  });

  // Refresh related queries
  const invalidatePostQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["saved-posts"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["post-comments"],
      }),
      queryClient.invalidateQueries({
      queryKey: ["profile"],
    }),
    ]);
  };

  // Create post
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: invalidatePostQueries,
  });

  // Update own post
  const updateMutation = useMutation({
    mutationFn: ({ postId, payload }) =>
      updatePost(postId, payload),
    onSuccess: invalidatePostQueries,
  });

  // Delete own post
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: invalidatePostQueries,
  });

  // Like / Unlike
  const likeMutation = useMutation({
    mutationFn: ({ postId, liked }) =>
      liked ? unlikePost(postId) : likePost(postId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      }),
  });

  // Save / Unsave
  const saveMutation = useMutation({
    mutationFn: ({ postId, saved }) =>
      saved ? unsavePost(postId) : savePost(postId),

    onSuccess: (_data, variables) => {
      const { postId, saved } = variables;

      if (saved) {
        queryClient.setQueryData(
          ["saved-posts"],
          (oldData) => {
            if (!oldData) return oldData;

            const currentSavedPosts =
              oldData?.data?.savedPosts ??
              oldData?.savedPosts;

            if (!Array.isArray(currentSavedPosts)) {
              return oldData;
            }

            const updatedSavedPosts =
              currentSavedPosts.filter((item) => {
                const savedPostId =
                  item.post?._id ?? item.post;

                return String(savedPostId) !==
                  String(postId);
              });

            if (oldData?.data?.savedPosts) {
              return {
                ...oldData,
                results: updatedSavedPosts.length,
                data: {
                  ...oldData.data,
                  savedPosts: updatedSavedPosts,
                },
              };
            }

            return {
              ...oldData,
              savedPosts: updatedSavedPosts,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["saved-posts"],
      });
    },
  });

  // Extract posts from API response
  const response = query.data;

  const posts = Array.isArray(response)
    ? response
    : response?.posts ??
      response?.data?.posts ??
      response?.data ??
      [];

  return {
    ...query,
    posts: Array.isArray(posts) ? posts : [],

    // Create
    createPost: createMutation.mutateAsync,
    isCreatingPost: createMutation.isPending,
    createPostError: createMutation.error,

    // Update
    updatePost: updateMutation.mutateAsync,
    isUpdatingPost: updateMutation.isPending,
    updatePostError: updateMutation.error,

    // Delete
    deletePost: deleteMutation.mutateAsync,
    isDeletingPost: deleteMutation.isPending,
    deletePostError: deleteMutation.error,

    // Like
    toggleLike: likeMutation.mutateAsync,
    isLiking: likeMutation.isPending,
    likeVariables: likeMutation.variables,
    likeError: likeMutation.error,

    // Save
    toggleSave: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveVariables: saveMutation.variables,
    saveError: saveMutation.error,
  };
};

export default usePosts;
