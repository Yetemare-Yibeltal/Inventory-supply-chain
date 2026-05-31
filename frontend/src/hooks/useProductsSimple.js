import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export const useProductsSimple = () => {
  // Query Pipeline: Efficiently fetch, store, and validate the products cache stream
  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products-simple"],
    queryFn: async () => {
      const res = await API.get("/products");
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes data freshness hold threshold configuration
    gcTime: 5 * 60 * 1000, // 5 minutes inactive memory garbage collection cleanup timeout
    keepPreviousData: true, // Retain previous state snapshot during active re-fetches to prevent layout shift
    onError: (err) => {
      console.error("Data pipeline communication suspension alert:", err);
    },
  });

  return {
    products,
    loading,
    error,
    refetch,
    isRefetching,
  };
};

export default useProductsSimple;


