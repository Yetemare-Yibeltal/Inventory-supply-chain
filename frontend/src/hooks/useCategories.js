import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Primary Query Pipeline: Fetch and monitor the universal categories cache cluster
  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // Keep cache clean and avoid repetitive backend hits
  });

  // Mutation Pipeline: Insert a new data entity element into the registry
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData) => {
      const res = await API.post("/categories", categoryData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate cluster to trigger automatic background synchronization matrix
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // Mutation Pipeline: Update an existing registry item block mapping
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await API.put(`/categories/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // Mutation Pipeline: Purge an item index node from the remote state layer
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      const res = await API.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    loading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isLoading,
    updateCategory: updateCategoryMutation.mutateAsync,
    isUpdating: updateCategoryMutation.isLoading,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isLoading,
  };
};

export default useCategories;

