import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

export const useSuppliers = () => {
  const queryClient = useQueryClient();

  // Primary Query Pipeline: Fetch and monitor the global suppliers cache layer
  const {
    data: suppliers = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await API.get("/suppliers");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache validity threshold window
    gcTime: 10 * 60 * 1000, // 10 minutes memory collection holding timeout
    keepPreviousData: true,
  });

  // Mutation Pipeline: Append a new supplier instance node to the server registry
  const createSupplierMutation = useMutation({
    mutationFn: async (supplierData) => {
      const res = await API.post("/suppliers", supplierData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate target keys to trigger automatic background synchronization lines
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  // Mutation Pipeline: Modify core details of a targeted supplier entity
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await API.put(`/suppliers/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  // Mutation Pipeline: Cleanly purge an individual supplier account from remote records
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id) => {
      const res = await API.delete(`/suppliers/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  return {
    suppliers,
    loading,
    error,
    refetch,
    isRefetching,
    createSupplier: createSupplierMutation.mutateAsync,
    isCreating: createSupplierMutation.isLoading,
    updateSupplier: updateSupplierMutation.mutateAsync,
    isUpdating: updateSupplierMutation.isLoading,
    deleteSupplier: deleteSupplierMutation.mutateAsync,
    isDeleting: deleteSupplierMutation.isLoading,
  };
};
export default useSuppliers;