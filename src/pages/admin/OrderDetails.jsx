
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Package,
  CreditCard,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";

import { getOrderById } from "../../services/order.service.js";
import Button from "../../components/common/Button.jsx";

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const timelineSteps = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const OrderDetails = () => {
  const { orderId } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
    staleTime: 30_000,
  });

  const order = data?.order ?? data?.data?.order ?? data?.data ?? data;

  if (isLoading) {
    return (
      <section className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Loading order details...
        </div>
      </section>
    );
  }

  if (isError || !order?._id) {
    return (
      <section className="space-y-4 p-4 sm:p-6">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
          <Package size={36} className="mx-auto text-red-400" />

          <h1 className="mt-3 text-lg font-semibold text-gray-900">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error?.response?.data?.message ||
              error?.message ||
              "Order not found. Please try again."}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>

            <Link
              to="/admin/orders"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const address = order.shippingAddress ?? {};
  const currentStatus = order.orderStatus;
  const isCancelled = currentStatus === "cancelled";
  const isPaid = order.paymentStatus === "paid";

  const currentStep = timelineSteps.indexOf(currentStatus);

  return (
    <section className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            Order Details
          </h1>

          <p className="mt-1 break-all text-sm text-gray-500">
            Order ID: {order._id}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh Details"}
        </Button>
      </div>

      {/* Order summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 text-gray-500">
            <Package size={19} />
            <span className="text-sm">Order Status</span>
          </div>

          <span
            className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
              statusStyles[currentStatus] || "bg-gray-100 text-gray-700"
            }`}
          >
            {currentStatus}
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 text-gray-500">
            <CreditCard size={19} />
            <span className="text-sm">Payment Status</span>
          </div>

          <span
            className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
              statusStyles[order.paymentStatus] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 text-gray-500">
            <CalendarDays size={19} />
            <span className="text-sm">Order Date</span>
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-900">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 text-gray-500">
            <CreditCard size={19} />
            <span className="text-sm">Order Total</span>
          </div>

          <p className="mt-4 text-xl font-bold text-gray-900">
            {formatPrice(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Order timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Order Timeline
        </h2>

        {isCancelled ? (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            This order has been cancelled.
          </div>
        ) : order.paymentStatus === "failed" ? (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Payment failed. The order has not been confirmed.
          </div>
        ) : order.paymentStatus !== "paid" ? (
          <div className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
            Waiting for payment. Order processing has not started.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {timelineSteps.map((step, index) => {
              const isComplete = currentStep >= index;
              const isCurrent = currentStatus === step;

              return (
                <div key={step} className="relative">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle2
                        size={22}
                        className="shrink-0 text-green-600"
                      />
                    ) : (
                      <Circle
                        size={22}
                        className="shrink-0 text-gray-300"
                      />
                    )}

                    <span
                      className={`text-sm capitalize ${
                        isCurrent
                          ? "font-semibold text-gray-900"
                          : isComplete
                            ? "text-green-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>

                  {isCurrent && (
                    <p className="ml-7 mt-1 text-xs text-blue-600">
                      Current status
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
        {/* Products */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Ordered Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.items?.length ?? 0} product(s) in this order
            </p>
          </div>

          {!order.items?.length ? (
            <p className="p-6 text-sm text-gray-500">
              No items found in this order.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div
                  key={item.product || `${item.name}-${index}`}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Unit price: {formatPrice(item.price)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-gray-900 sm:text-right">
                    {formatPrice(
                      item.subtotal ?? item.price * item.quantity,
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 border-t border-gray-200 p-5">
            <div className="flex justify-between gap-4 text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>

            <div className="flex justify-between gap-4 text-sm text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Customer and payment details */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <UserRound size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Details
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Full name</p>
                <p className="mt-1 font-medium text-gray-900">
                  {address.fullName || order.user?.name || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="mt-1 break-all font-medium text-gray-900">
                  {order.user?.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="mt-1 font-medium text-gray-900">
                  {address.phone || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>

            <div className="mt-5 space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">
                {address.fullName || "—"}
              </p>
              <p>{address.addressLine || "—"}</p>
              <p>
                {[address.city, address.state]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
              <p>Postal code: {address.postalCode || "—"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Payment method</p>
                <p className="mt-1 font-medium capitalize text-gray-900">
                  {order.paymentMethod || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Payment reference</p>
                <p className="mt-1 break-all font-medium text-gray-900">
                  {order.paymentReference || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Last updated</p>
                <p className="mt-1 flex items-center gap-2 font-medium text-gray-900">
                  <Clock3 size={15} />
                  {formatDate(order.updatedAt)}
                </p>
              </div>

              {!isPaid && (
                <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  This order has not been paid successfully.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to all orders
        </Link>
      </div>
    </section>
  );
};

export default OrderDetails;
