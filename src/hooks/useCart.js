import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cart.service.js";

const useCart = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    staleTime: 30_000,
  });

  const refreshCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity = 1 }) => addToCart(productId, quantity),
    onSuccess: refreshCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItem(productId, quantity),
    onSuccess: refreshCart,
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: refreshCart,
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: refreshCart,
  });

  const response = query.data;
  const cart = response?.cart ?? response?.data?.cart ?? null;

  return {
    ...query,
    cart,
    items: cart?.items ?? [],
    totalItems: cart?.totalItems ?? 0,
    totalPrice: cart?.totalPrice ?? 0,

    addToCart: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    addError: addMutation.error,

    updateCartItem: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    removeCartItem: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,

    clearCart: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
  };
};

export default useCart;
