import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

const useProducts = (params = {}) => {
  const queryClient = useQueryClient();

  // Fetch products
  const query = useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 30_000,
  });

  // Create product
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Update product
  const updateMutation = useMutation({
    mutationFn: ({ productId, formData }) => updateProduct(productId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Deactivate product
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Extract products from API response
  const response = query.data;

  const products = Array.isArray(response)
    ? response
    : (response?.products ?? response?.data?.products ?? []);

  return {
    ...query,

    products: Array.isArray(products) ? products : [],

    total: response?.total ?? response?.data?.total ?? 0,
    totalPages: response?.totalPages ?? response?.data?.totalPages ?? 0,
    currentPage: response?.page ?? response?.data?.page ?? 1,

    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};

export default useProducts;
