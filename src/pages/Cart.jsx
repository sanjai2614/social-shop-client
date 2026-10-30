
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import useCart from "../hooks/useCart.js";
import Button from "../components/common/Button.jsx";

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

const Cart = () => {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isError,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,
    clearCart,
  } = useCart();

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    await updateCartItem({ productId, quantity });
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-gray-500">Loading your cart...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-red-600">
          {error?.response?.data?.message || "Unable to load your cart."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        <p className="mb-8 text-sm text-gray-500">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-300" />

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore products and add something you like.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            {/* Cart items */}
            <section className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const productId = product._id;
                const busy = isUpdating || isRemoving || isAdding;

                return (
                  <article
                    key={productId}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row"
                  >
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-28">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatPrice(product.price)} each
                        </p>

                        {product.stock < item.quantity && (
                          <p className="mt-1 text-sm text-red-600">
                            Only {product.stock} available. Please update quantity.
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={busy || item.quantity <= 1}
                            onClick={() =>
                              handleQuantityChange(productId, item.quantity - 1)
                            }
                            className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-5 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={busy || item.quantity >= product.stock}
                            onClick={() =>
                              handleQuantityChange(productId, item.quantity + 1)
                            }
                            className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="font-bold text-gray-900">
                          {formatPrice(item.subtotal ?? product.price * item.quantity)}
                        </p>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeCartItem(productId)}
                          aria-label={`Remove ${product.name}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              <button
                type="button"
                disabled={isClearing}
                onClick={() => clearCart()}
                className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear cart"}
              </button>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 flex justify-between text-sm text-gray-600">
                <span>Items ({totalItems})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex justify-between gap-3 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              
<Link
  to="/checkout"
  className="mt-6 block w-full rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
>
  Proceed to Checkout
</Link>


              <Link
                to="/products"
                className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:underline"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
