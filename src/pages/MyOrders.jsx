
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingBag,
  ArrowRight,
  LoaderCircle,
  CalendarDays,
} from "lucide-react";

import { getMyOrders } from "../services/order.service.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price ?? 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getStatusStyle = (status) => {
  const styles = {
    confirmed: "bg-green-100 text-green-700",
    delivered: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

const MyOrders = () => {
  const {
    data: response,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const orders = response?.orders ?? [];

  if (isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={36}
            className="mx-auto animate-spin text-indigo-600"
          />
          <p className="mt-3 text-gray-500">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">
            Unable to load orders
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error?.response?.data?.message ||
              "Something went wrong while loading your orders."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
            <Package size={26} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and track your purchases.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <ShoppingBag
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your purchases will appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Explore Products
            </Link>
          </section>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                      {order._id}
                    </p>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarDays size={15} />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(order.paymentStatus)}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex items-center gap-4"
                    >
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>

                  <Link
                    to={`/order-confirmation/${order._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    View Order
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
