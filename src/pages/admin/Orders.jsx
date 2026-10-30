import { useMemo, useState } from "react";
import { Search, Package, RefreshCw,Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useOrders from "../../hooks/useOrders.js";
import Button from "../../components/common/Button.jsx";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-indigo-50 text-indigo-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  const {
    orders,
    total,
    isLoading,
    isError,
    error,
    updateOrderStatus,
    isUpdating,
  } = useOrders();

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !searchValue ||
        order._id?.toLowerCase().includes(searchValue) ||
        order.user?.name?.toLowerCase().includes(searchValue) ||
        order.user?.email?.toLowerCase().includes(searchValue);

      const matchesPayment =
        !paymentFilter || order.paymentStatus === paymentFilter;

      const matchesStatus = !statusFilter || order.orderStatus === statusFilter;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [orders, search, paymentFilter, statusFilter]);

  const handleStatusChange = async (order, orderStatus) => {
    if (orderStatus === order.orderStatus) return;

    const confirmed = window.confirm(
      `Change order status to "${orderStatus}"?`,
    );

    if (!confirmed) return;

    setUpdatingOrderId(order._id);

    try {
      await updateOrderStatus({
        orderId: order._id,
        orderStatus,
      });
    } catch (error) {
      window.alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update order status.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <section className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View customer orders and manage order status.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_190px_190px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order ID, customer..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All order statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading orders...
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-sm text-red-600">
            {error?.response?.data?.message ||
              "Unable to load orders. Please try again."}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center">
            <Package size={36} className="text-gray-300" />
            <h2 className="mt-3 font-semibold text-gray-800">
              No orders found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-262.5 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 font-medium">Order Status</th>
                    <th className="px-5 py-3 font-medium">Update Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const isFailed = order.paymentStatus !== "paid";

                    const isTerminal = ["delivered", "cancelled"].includes(
                      order.orderStatus,
                    );

                    const isRowUpdating =
                      isUpdating && updatingOrderId === order._id;

                    return (
                      <tr
                        key={order._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.items.length} item(s)
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {order.user?.name || "Unknown"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.user?.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                              statusStyles[order.paymentStatus] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                              statusStyles[order.orderStatus] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={order.orderStatus}
                            disabled={isFailed || isTerminal || isRowUpdating}
                            onChange={(event) =>
                              handleStatusChange(order, event.target.value)
                            }
                            aria-label={`Update order ${order._id} status`}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
                          >
                            <option value={order.orderStatus}>
                              {order.orderStatus}
                            </option>
                            {[
                              "confirmed",
                              "processing",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ]
                              .filter((status) => status !== order.orderStatus)
                              .map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                          </select>

                          {isRowUpdating && (
                            <RefreshCw
                              size={14}
                              className="ml-2 inline animate-spin text-gray-500"
                            />
                          )}

                          {isFailed && (
                            <p className="mt-1 text-xs text-red-500">
                              Payment not paid
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
  <button
    type="button"
    onClick={() =>
      navigate(`/admin/orders/${order._id}`)
    }
    aria-label={`View order ${order._id}`}
    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
  >
    <Eye size={16} />
    View
  </button>
</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {total} orders
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw size={16} />
          Refresh Orders
        </Button>
      </div>
    </section>
  );
};

export default Orders;
