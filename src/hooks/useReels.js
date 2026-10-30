
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchReels,
  createReel as createReelService,
  deleteReel as deleteReelService,
} from "../services/reel.service.js";

const useReels = (params = {}) => {
  const queryClient = useQueryClient();

  // Fetch reels
  const query = useQuery({
    queryKey: ["reels", params],
    queryFn: () => fetchReels(params),
    staleTime: 30_000,
  });

  // Invalidate related queries
  const invalidateReelQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["reels"],
    });
  };

  // Create reel
  const createMutation = useMutation({
    mutationFn: createReelService,
    onSuccess: invalidateReelQueries,
  });

  // Delete own reel
  const deleteMutation = useMutation({
    mutationFn: deleteReelService,
    onSuccess: invalidateReelQueries,
  });

  // Extract reels from API response
  const response = query.data;

  const reels = Array.isArray(response)
    ? response
    : response?.reels ??
      response?.data?.reels ??
      [];

  return {
    ...query,
    reels: Array.isArray(reels) ? reels : [],

    // Create
    createReel: createMutation.mutateAsync,
    isCreatingReel: createMutation.isPending,
    createReelError: createMutation.error,

    // Delete
    deleteReel: deleteMutation.mutateAsync,
    isDeletingReel: deleteMutation.isPending,
    deleteReelError: deleteMutation.error,
  };
};

export default useReels;
