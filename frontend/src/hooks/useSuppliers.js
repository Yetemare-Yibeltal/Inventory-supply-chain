import { useState, useEffect } from "react";
import API from "../services/api";

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get("/suppliers")
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  return { suppliers, loading };
};
export default useSuppliers;
