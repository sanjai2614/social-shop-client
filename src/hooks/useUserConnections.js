import { useQuery } from "@tanstack/react-query";
import { getFollowers, getFollowing } from "../services/user.service.js";

const useUserConnections = (userId, type, enabled = true) => {
  const query = useQuery({
    queryKey: ["user-connections", userId, type],
    queryFn: async () => {
  try {
    const response =
      type === "followers"
        ? await getFollowers(userId)
        : await getFollowing(userId);

    console.log("Connections response:", response);

    const body = response?.data ?? response;

    const users =
      type === "followers"
        ? body?.data?.followers ?? body?.followers
        : body?.data?.following ?? body?.following;

    if (!Array.isArray(users)) {
      console.error("Unexpected connections response:", body);
      throw new Error("Invalid followers/following response format");
    }

    return users;
  } catch (error) {
    console.error("Connections API failed:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    throw error;
  }
},
    enabled: Boolean(userId && type && enabled),
    staleTime: 30_000,
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useUserConnections;
