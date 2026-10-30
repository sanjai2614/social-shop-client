import {
  ShoppingBag,
  IndianRupee,
  Package,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import useDashboard from "../../hooks/useDashboard.js";
import Button from "../../components/common/Button.jsx";
import RevenueChart from "./RevenueChart.jsx";

const statCards = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: IndianRupee,
    format: (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingBag,
    format: (value) => Number(value || 0).toLocaleString("en-IN"),
  },
  {
    key: "totalProducts",
    label: "Active Products",
    icon: Package,
    format: (value) => Number(value || 0).toLocaleString("en-IN"),
  },
  {
    key: "totalCustomers",
    label: "Customers",
    icon: Users,
    format: (value) => Number(value || 0).toLocaleString("en-IN"),
  },
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatStatus = (status = "") =>
  status.charAt(0).toUpperCase() + status.slice(1);

const statusStyle = {
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-indigo-50 text-indigo-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const Dashboard = () => {
  const {
    stats,
    recentOrders,
    lowStockProducts,
    orderStatusSummary,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    monthlyRevenue,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <p className="font-medium text-red-600">Failed to load dashboard</p>
        <p className="mt-1 text-sm text-gray-500">
          {error?.message || "Something went wrong"}
        </p>
        <Button type="button" onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your store performance.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <div className="rounded-xl bg-gray-100 p-3">
                  <Icon size={21} className="text-gray-700" />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-gray-900">
                {card.format(stats[card.key])}
              </p>
            </div>
          );
        })}
      </div>

      <RevenueChart data={monthlyRevenue} />

      {/* Order status */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Order Status Overview
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {orderStatusSummary.map((item) => (
            <div key={item.status} className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                {formatStatus(item.status)}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest 5 orders placed in your store.
          </p>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-162.5 text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {order.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user?.email || ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-900">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyle[order.paymentStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {formatStatus(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyle[order.orderStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Low Stock Products */}
      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 p-5">
          <AlertCircle size={20} className="text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Products
            </h2>
            <p className="text-sm text-gray-500">
              Products with 5 or fewer items in stock.
            </p>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">
            No low-stock products found.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <Package size={20} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
