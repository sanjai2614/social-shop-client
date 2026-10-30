import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "../services/user.service.js";

const useFollow = (userId) => {
  const queryClient = useQueryClient();

  const refreshProfileData = () => {
    queryClient.invalidateQueries({
      queryKey: ["profile"],
    });

    queryClient.invalidateQueries({
      queryKey: ["auth", "me"],
    });
  };

const followMutation = useMutation({
  mutationFn: () => followUser(userId),
  onSuccess: () => {
    queryClient.setQueryData(["profile", userId], (oldData) => {
      if (!oldData?.user) return oldData;

      return {
        ...oldData,
        user: {
          ...oldData.user,
          isFollowing: true,
        },
      };
    });

    queryClient.invalidateQueries({ queryKey: ["profile"] });
  },
});

const unfollowMutation = useMutation({
  mutationFn: () => unfollowUser(userId),
  onSuccess: () => {
    queryClient.setQueryData(["profile", userId], (oldData) => {
      if (!oldData?.user) return oldData;

      return {
        ...oldData,
        user: {
          ...oldData.user,
          isFollowing: false,
        },
      };
    });

    queryClient.invalidateQueries({ queryKey: ["profile"] });
  },
});

  return {
    follow: followMutation.mutateAsync,
    unfollow: unfollowMutation.mutateAsync,
    isFollowingLoading: followMutation.isPending || unfollowMutation.isPending,
  };
};

export default useFollow;
