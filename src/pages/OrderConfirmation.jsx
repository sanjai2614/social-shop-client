
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  MapPin,
  Receipt,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

import { getOrderById } from "../services/order.service.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price ?? 0);

const OrderConfirmation = () => {
  const { orderId } = useParams();

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
    retry: 1,
  });

  const order = response?.order;

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto animate-spin text-indigo-600" size={36} />
          <p className="mt-3 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Package className="mx-auto text-gray-400" size={48} />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Order not found
        </h1>
        <p className="mt-2 text-gray-600">
          {error?.response?.data?.message ||
            "Unable to load this order. Please try again."}
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress;
  const isPaid = order.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Order status */}
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          {isPaid ? (
            <CheckCircle2
              size={64}
              className="mx-auto mb-4 text-green-600"
            />
          ) : (
            <Package
              size={64}
              className="mx-auto mb-4 text-amber-500"
            />
          )}

          <h1 className="text-3xl font-bold text-gray-900">
            {isPaid ? "Order Confirmed!" : "Order Details"}
          </h1>

          <p className="mt-2 text-gray-600">
            {isPaid
              ? "Thank you for your purchase."
              : "Your order payment is not completed yet."}
          </p>

          <span
            className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              isPaid
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            Payment: {order.paymentStatus}
          </span>

          <p className="mt-4 break-all text-sm text-gray-500">
            Order ID:{" "}
            <span className="font-medium text-gray-900">
              {order._id}
            </span>
          </p>
        </section>

        {/* Products */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Package size={22} />
            <h2 className="text-xl font-semibold">Order Items</h2>
          </div>

          <div className="space-y-5">
            {order.items?.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="h-24 w-20 rounded-lg bg-gray-100 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {formatPrice(item.price)} each
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-5">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-indigo-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </section>

        {/* Delivery address */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={22} />
            <h2 className="text-xl font-semibold">Delivery Address</h2>
          </div>

          <div className="space-y-1 text-gray-600">
            <p className="font-semibold text-gray-900">
              {address?.fullName}
            </p>
            <p>{address?.phone}</p>
            <p>{address?.addressLine}</p>
            <p>
              {address?.city}, {address?.state} - {address?.postalCode}
            </p>
          </div>
        </section>

        {/* Payment information */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Receipt size={22} />
            <h2 className="text-xl font-semibold">Payment Details</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium capitalize">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Payment Reference</span>
              <span className="break-all text-right font-medium">
                {order.paymentReference || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Order Status</span>
              <span className="font-medium capitalize">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/products"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-medium text-white hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>

          <Link
            to="/my-orders"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 hover:bg-gray-100"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
