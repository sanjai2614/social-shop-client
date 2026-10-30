import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostComments,
  createPostComment,
} from "../services/post.service.js";

const usePostComments = (postId, enabled = true) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => getPostComments(postId),
    enabled: Boolean(postId) && enabled,
    staleTime: 30_000,
  });

  const response = query.data;

  const comments = Array.isArray(response)
    ? response
    : (response?.data?.comments ??
      response?.comments ??
      response?.data?.data?.comments ??
      []);

  const commentMutation = useMutation({
    mutationFn: (content) => createPostComment(postId, { content }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  return {
    ...query,
    comments: Array.isArray(comments) ? comments : [],
    addComment: commentMutation.mutateAsync,
    isAddingComment: commentMutation.isPending,
    commentError: commentMutation.error,
  };
};

export default usePostComments;
