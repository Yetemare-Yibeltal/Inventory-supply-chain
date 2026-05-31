import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Primary Query Pipeline: Fetch and monitor the global products record cache
  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await API.get("/products");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes data cache validity threshold window
    gcTime: 10 * 60 * 1000, // 10 minutes memory collection holding timeout
    keepPreviousData: true,
  });

  // Mutation Pipeline: Append a new product record item block to the backend schema
  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      const res = await API.post("/products", productData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate target keys to trigger automatic background synchronization lines
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation Pipeline: Modify structural details of a targeted product instance node
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await API.put(`/products/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation Pipeline: Cleanly purge an individual product entity out of server records
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      const res = await API.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products,
    loading,
    error,
    refetch,
    isRefetching,
    createProduct: createProductMutation.mutateAsync,
    isCreating: createProductMutation.isLoading,
    updateProduct: updateProductMutation.mutateAsync,
    isUpdating: updateProductMutation.isLoading,
    deleteProduct: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isLoading,
  };
};

export default useProducts;

