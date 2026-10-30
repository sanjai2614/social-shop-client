
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

import { getProductById } from "../services/product.service.js";
import useCart from "../hooks/useCart.js";

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

const ProductDetails = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    addToCart,
    isAdding,
  } = useCart();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
    staleTime: 30_000,
  });

  const product = data?.product ?? data?.data?.product;

  const handleAddToCart = async () => {
    setMessage("");
    setErrorMessage("");

    try {
      await addToCart({
        productId: product._id,
        quantity,
      });

      setMessage("Product added to your cart!");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to add product to cart.",
      );
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl animate-pulse px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-gray-200" />
          <div className="space-y-5 py-4">
            <div className="h-5 w-1/3 rounded bg-gray-200" />
            <div className="h-9 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/2 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShoppingBag size={44} className="mx-auto text-gray-300" />

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            "This product may no longer be available."}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Try again
          </button>

          <Link
            to="/products"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images?.filter(Boolean) ?? [];
  const inStock = product.stock > 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>

        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:grid-cols-2 md:gap-10 lg:p-8">
          {/* Product images */}
          <section>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ShoppingBag size={64} className="text-gray-300" />
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                      selectedImage === index
                        ? "border-indigo-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product information */}
          <section className="flex flex-col py-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {product.category?.name || "General"}
            </p>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>

            <p
              className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                inStock
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {inStock ? `${product.stock} available` : "Out of stock"}
            </p>

            <div className="my-6 border-t border-gray-200" />

            <h2 className="font-semibold text-gray-900">
              Product description
            </h2>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-gray-800">
                Quantity
              </p>

              <div className="flex w-fit items-center gap-4 rounded-xl border border-gray-200 p-1.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || !inStock}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-8 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!inStock || quantity >= product.stock}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(product.stock, current + 1)
                    )
                  }
                  className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={19} />
              {isAdding
                ? "Adding to cart..."
                : inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
            </button>

            {message && (
              <div
                role="status"
                className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700"
              >
                <CheckCircle size={18} />
                <span>{message}</span>
                <Link
                  to="/cart"
                  className="ml-auto underline underline-offset-2"
                >
                  View cart
                </Link>
              </div>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600"
              >
                {errorMessage}
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
