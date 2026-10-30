import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getAllOrders, updateOrderStatus } from "../services/order.service.js";

const useOrders = () => {
  const queryClient = useQueryClient();

  // Fetch all orders
  const query = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
    staleTime: 30_000,
  });

  // Update order status
  const updateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus(orderId, orderStatus),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["order"],
        }),
      ]);
    },
  });

  const response = query.data;

  const orders = Array.isArray(response)
    ? response
    : (response?.orders ?? response?.data?.orders ?? []);

  return {
    ...query,

    orders: Array.isArray(orders) ? orders : [],
    total: response?.results ?? orders.length,

    updateOrderStatus: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};

export default useOrders;
