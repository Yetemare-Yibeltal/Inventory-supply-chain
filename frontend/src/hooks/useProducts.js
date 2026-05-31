import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => API.get("/products").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useProducts;
