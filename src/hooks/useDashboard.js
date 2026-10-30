import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard.service.js";

const useDashboard = () => {
  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardStats,
    staleTime: 30_000,
  });

  const response = query.data;
  const data = response?.data ?? response;

  return {
    ...query,
    stats: data?.stats ?? {},
    recentOrders: data?.recentOrders ?? [],
    lowStockProducts: data?.lowStockProducts ?? [],
    orderStatusSummary: data?.orderStatusSummary ?? [],
    monthlyRevenue: data?.monthlyRevenue ?? [],
  };
};

export default useDashboard;
