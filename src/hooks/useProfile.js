import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserProfile, updateUserProfile } from "../services/user.service.js";

const useProfile = (userId) => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      return response;
    },
  });

  return {
    profile: profileQuery.data?.user ?? null,

    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,

    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    updateSuccess: updateMutation.isSuccess,
  };
};

export default useProfile;
