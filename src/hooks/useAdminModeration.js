
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminPosts,
  updateAdminPostStatus,
  getAdminComments,
  updateAdminCommentStatus,
} from "../services/post.service.js";

import {
  getAdminReels,
  updateAdminReelStatus,
    getAdminReelComments,
  updateAdminReelCommentStatus,
} from "../services/reel.service.js";

export const useAdminPosts = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-posts", params],
    queryFn: () => getAdminPosts(params),
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: ({ postId, isActive }) =>
      updateAdminPostStatus(postId, isActive),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["saved-posts"] }),
      ]);
    },
  });

  const response = query.data?.data ?? query.data;

  return {
    ...query,
    posts: response?.posts ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    totalPages: response?.totalPages ?? 0,
    updatePostStatus: mutation.mutateAsync,
    isUpdatingPost: mutation.isPending,
  };
};

export const useAdminComments = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-comments", params],
    queryFn: () => getAdminComments(params),
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: ({ commentId, isActive }) =>
      updateAdminCommentStatus(commentId, isActive),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
        queryClient.invalidateQueries({ queryKey: ["post-comments"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);
    },
  });

  const response = query.data?.data ?? query.data;

  return {
    ...query,
    comments: response?.comments ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    totalPages: response?.totalPages ?? 0,
    updateCommentStatus: mutation.mutateAsync,
    isUpdatingComment: mutation.isPending,
  };
};



export const useAdminReels = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-reels", params],
    queryFn: () => getAdminReels(params),
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: ({ reelId, isActive }) =>
      updateAdminReelStatus(reelId, isActive),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-reels"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reels"],
        }),
      ]);
    },
  });

  const response = query.data?.data ?? query.data;

  return {
    ...query,
    reels: response?.reels ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    totalPages: response?.totalPages ?? 0,
    updateReelStatus: mutation.mutateAsync,
    isUpdatingReel: mutation.isPending,
  };
};



export const useAdminReelComments = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-reel-comments", params],
    queryFn: () => getAdminReelComments(params),
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: ({ commentId, isActive }) =>
      updateAdminReelCommentStatus(commentId, isActive),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-reel-comments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reel-comments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reels"],
        }),
      ]);
    },
  });

  const response = query.data?.data ?? query.data;

  return {
    ...query,
    comments: response?.comments ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    totalPages: response?.totalPages ?? 0,
    updateReelCommentStatus: mutation.mutateAsync,
    isUpdatingReelComment: mutation.isPending,
  };
};
