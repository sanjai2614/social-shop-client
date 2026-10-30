
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminUsers,
  updateAdminUserStatus,
} from "../services/user.service.js";

const useAdminUsers = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAdminUsers(params),
    staleTime: 30_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }) =>
      updateAdminUserStatus(userId, isActive),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const response = query.data?.data ?? query.data;

  return {
    ...query,
    users: response?.users ?? [],
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    totalPages: response?.totalPages ?? 0,

    updateUserStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,
    statusError: statusMutation.error,
  };
};

export default useAdminUsers;
