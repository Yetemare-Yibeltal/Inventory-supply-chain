import { useQueries } from "@tanstack/react-query";
import API from "../services/api";z

const dashboardQueries = [
  {
    queryKey: ["products"],
    queryFn: () => API.get("/products").then((res) => res.data),
  },
  {
    queryKey: ["categories"],
    queryFn: () => API.get("/categories").then((res) => res.data),
  },
  {
    queryKey: ["purchase-orders"],
    queryFn: () => API.get("/purchase-orders").then((res) => res.data),
  },
];

const useDashboardData = () => {
  const results = useQueries({ queries: dashboardQueries });

  const isLoading = results.some((result) => result.isLoading);
  const error = results.find((result) => result.error);

  const [products, categories, purchaseOrders] = results.map(
    (result) => result.data || [],
  );

  if (isLoading) return { loading: true, error: null, data: null };
  if (error) return { loading: false, error: error.error, data: null };

  // Compute dashboard metrics
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (p) => p.quantityOnHand <= p.reorderPoint,
  ).length;
  const pendingOrdersCount = purchaseOrders.filter(
    (po) => po.status === "PENDING",
  ).length;

  const categoryStats = Object.entries(
    products.reduce((acc, p) => {
      const catName = p.category?.name || "Uncategorized";
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const statusStats = Object.entries(
    purchaseOrders.reduce((acc, po) => {
      acc[po.status] = (acc[po.status] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const recentLowStock = products
    .filter((p) => p.quantityOnHand <= p.reorderPoint)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sku: p.sku,
      qty: p.quantityOnHand,
      reorderPoint: p.reorderPoint,
    }));

  const recentPurchaseOrders = purchaseOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((po) => ({
      poNumber: po.poNumber,
      supplier: po.supplier?.name || "Unknown",
      date: new Date(po.createdAt).toLocaleDateString(),
      totalAmount: po.totalAmount,
      status: po.status,
    }));

  const productSales = {};
  purchaseOrders
    .filter((po) => po.status === "RECEIVED")
    .flatMap((po) => po.items || [])
    .forEach((item) => {
      const name = item.product?.name || "Unknown";
      const qty = item.quantity || 0;
      const revenue = qty * (item.unitPrice || 0);
      if (!productSales[name]) productSales[name] = { soldQty: 0, revenue: 0 };
      productSales[name].soldQty += qty;
      productSales[name].revenue += revenue;
    });

  const topProducts = Object.entries(productSales)
    .map(([name, stats]) => ({
      name,
      soldQty: stats.soldQty,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const dashboardData = {
    totalProducts,
    lowStockCount,
    pendingOrdersCount,
    categoryStats,
    statusStats,
    recentLowStock,
    recentPurchaseOrders,
    topProducts,
  };

  return { loading: false, error: null, data: dashboardData };
};

export default useDashboardData;
