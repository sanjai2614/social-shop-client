import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const ProductCard = ({ product }) => {
  const image = product.images?.[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/products/${product._id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <ShoppingBag size={40} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-600">
          {product.category?.name || "General"}
        </p>

        <Link to={`/products/${product._id}`}>
          <h2 className="line-clamp-2 min-h-12 font-semibold text-gray-900 hover:text-indigo-600">
            {product.name}
          </h2>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-lg font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <Link
            to={`/products/${product._id}`}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            View
          </Link>
        </div>

        <p
          className={`mt-3 text-xs font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;