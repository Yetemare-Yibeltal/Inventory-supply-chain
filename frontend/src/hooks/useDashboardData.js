import { useQueries } from "@tanstack/react-query";
import API from "../services/api";

const useDashboardData = () => {
  // Parallel multi-stream cache execution layer configuration
  const results = useQueries({
    queries: [
      {
        queryKey: ["products"],
        queryFn: async () => {
          const res = await API.get("/products");
          return res.data;
        },
        staleTime: 3 * 60 * 1000, // 3 minutes analytical freshness data window
        keepPreviousData: true,
      },
      {
        queryKey: ["categories"],
        queryFn: async () => {
          const res = await API.get("/categories");
          return res.data;
        },
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["purchase-orders"],
        queryFn: async () => {
          const res = await API.get("/purchase-orders");
          return res.data;
        },
        staleTime: 2 * 60 * 1000,
      },
    ],
  });

  // Synchronize loading and failure metrics across network channels
  const isLoading = results.some((result) => result.isLoading);
  const isRefetching = results.some((result) => result.isRefetching);
  const errorInstance = results.find((result) => result.error);

  const [products = [], categories = [], purchaseOrders = []] = results.map(
    (result) => result.data || [],
  );

  if (isLoading) {
    return { loading: true, refetching: false, error: null, data: null };
  }

  if (errorInstance) {
    return {
      loading: false,
      refetching: false,
      error: errorInstance.error,
      data: null,
    };
  }

  // Pipeline Metric 1: Absolute Total Counts
  const totalProducts = products.length;

  // Pipeline Metric 2: Inventory Safety Critical Reorder Check
  const lowStockCount = products.filter(
    (p) => (p.quantityOnHand ?? 0) <= (p.reorderPoint ?? 0),
  ).length;

  // Pipeline Metric 3: Active Document Operational Pipeline Monitoring
  const pendingOrdersCount = purchaseOrders.filter(
    (po) => po.status === "PENDING",
  ).length;

  // Pipeline Metric 4: Category Distribution Vector Mapping
  const categoryStats = Object.entries(
    products.reduce((acc, p) => {
      const catName = p.category?.name || "Uncategorized";
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  // Pipeline Metric 5: Fulfillment Status Aggregate Breakdowns
  const statusStats = Object.entries(
    purchaseOrders.reduce((acc, po) => {
      if (po.status) {
        acc[po.status] = (acc[po.status] || 0) + 1;
      }
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  // Pipeline Metric 6: High Priority Low Stock Alerts (Top 5 Rows)
  const recentLowStock = products
    .filter((p) => (p.quantityOnHand ?? 0) <= (p.reorderPoint ?? 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sku: p.sku,
      qty: p.quantityOnHand,
      reorderPoint: p.reorderPoint,
    }));

  // Pipeline Metric 7: Reverse Chronological Ledger Stream (Top 5 Rows)
  const recentPurchaseOrders = [...purchaseOrders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map((po) => ({
      poNumber: po.poNumber,
      supplier: po.supplier?.name || "Unknown",
      date: po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "N/A",
      totalAmount: po.totalAmount || 0,
      status: po.status || "UNKNOWN",
    }));

  // Pipeline Metric 8: Top Revenue Items Matrix Execution Loop
  const productSales = {};
  purchaseOrders
    .filter((po) => po.status === "RECEIVED")
    .flatMap((po) => po.items || [])
    .forEach((item) => {
      const name = item.product?.name || "Unknown";
      const qty = item.quantity || 0;
      const revenue = qty * (item.unitPrice || 0);

      if (!productSales[name]) {
        productSales[name] = { soldQty: 0, revenue: 0 };
      }
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

  return {
    loading: false,
    refetching: isRefetching,
    error: null,
    data: dashboardData,
  };
};

export default useDashboardData;
