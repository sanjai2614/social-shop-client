
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle, MapPin, ShoppingBag } from "lucide-react";

import useCart from "../hooks/useCart.js";
import { checkoutOrder, processDemoPayment } from "../services/order.service.js";

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
};

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isError,
    error,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [paymentError, setPaymentError] = useState("");
  const [paymentResult, setPaymentResult] = useState("success");

 const checkoutMutation = useMutation({
  mutationFn: async ({ address, paymentResult }) => {
    const checkoutResponse = await checkoutOrder(address);

    if (!checkoutResponse?.success || !checkoutResponse?.order?._id) {
      throw new Error(
        checkoutResponse?.message || "Unable to create order.",
      );
    }

    return processDemoPayment(
      checkoutResponse.order._id,
      paymentResult,
    );
  },

  
onSuccess: async (paymentResponse) => {
  const order = paymentResponse?.order;

  if (order?.paymentStatus === "paid") {
    await queryClient.invalidateQueries({
      queryKey: ["cart"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["order"],
    });

    navigate(`/order-confirmation/${order._id}`, {
      replace: true,
    });
    return;
  }

  if (order?.paymentStatus === "failed") {
    navigate(`/order-confirmation/${order._id}`, {
      replace: true,
    });
    return;
  }

  setPaymentError("Payment could not be completed.");
},


  onError: (err) => {
    setPaymentError(
      err?.response?.data?.message ||
        err?.message ||
        "Checkout failed. Please try again.",
    );
  },
});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

 const handleSubmit = (event) => {
  event.preventDefault();
  setPaymentError("");

  checkoutMutation.mutate({
    address: shippingAddress,
    paymentResult,
  });
};

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-gray-500">Loading checkout...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-red-600">
          {error?.response?.data?.message || "Unable to load your cart."}
        </p>
        <Link to="/cart" className="mt-4 inline-block text-indigo-600">
          Return to cart
        </Link>
      </main>
    );
  }

  if (!items?.length) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <ShoppingBag size={44} className="mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">
          Add products before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-white"
        >
          Explore Products
        </Link>
      </main>
    );
  }

  const busy = checkoutMutation.isPending;

  const fields = [
    { name: "fullName", label: "Full name", autoComplete: "name" },
    { name: "phone", label: "Phone number", autoComplete: "tel", type: "tel" },
    { name: "addressLine", label: "Address", autoComplete: "street-address" },
    { name: "city", label: "City", autoComplete: "address-level2" },
    { name: "state", label: "State", autoComplete: "address-level1" },
    { name: "postalCode", label: "Postal code", autoComplete: "postal-code" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-gray-500">
          Enter your delivery details and review your order.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_340px]"
        >
          {/* Delivery form */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="text-indigo-600" size={23} />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.name === "addressLine" ? "sm:col-span-2" : ""
                  }
                >
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    autoComplete={field.autoComplete}
                    value={shippingAddress[field.name]}
                    onChange={handleChange}
                    required
                    maxLength={field.name === "addressLine" ? 200 : 100}
                    disabled={busy}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>

            {paymentError && (
              <p
                role="alert"
                className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {paymentError}
              </p>
            )}
          </section>

    


          {/* Summary */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div
                    key={product._id}
                    className="flex gap-3"
                  >
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold">
                      {formatPrice(item.subtotal ?? product.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex justify-between text-sm text-gray-600">
              <span>Items ({totalItems})</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex justify-between gap-3 text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

                  
<div className="mt-6">
  <h2 className="mb-3 text-lg font-semibold text-gray-900">
    Demo Payment
  </h2>

  <p className="mb-3 text-sm text-gray-500">
    Testing purpose-ku payment outcome select pannunga.
  </p>

  <div className="grid gap-3 sm:grid-cols-2">
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
      <input
        type="radio"
        name="paymentResult"
        value="success"
        checked={paymentResult === "success"}
        onChange={(event) => setPaymentResult(event.target.value)}
      />
      <span className="text-sm font-medium text-gray-800">
        Simulate Success
      </span>
    </label>

    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
      <input
        type="radio"
        name="paymentResult"
        value="failure"
        checked={paymentResult === "failure"}
        onChange={(event) => setPaymentResult(event.target.value)}
      />
      <span className="text-sm font-medium text-gray-800">
        Simulate Failure
      </span>
    </label>
  </div>
</div>

            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              Demo payment only. No real money will be charged.
            </p>

            <button
              type="submit"
              disabled={busy || !items.length}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>

            <Link
              to="/products"
              className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
