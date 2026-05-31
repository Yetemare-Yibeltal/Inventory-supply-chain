import { useState, useEffect } from "react";
import API from "../services/api";

const useProductsSimple = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  return { products, loading };
};
export default useProductsSimple;
