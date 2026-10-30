
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";

import useProducts from "../../hooks/useProducts.js";
import useCategories from "../../hooks/useCategories.js";
import ProductFormModal from "../../components/products/ProductFormModal.jsx";
import Button from "../../components/common/Button.jsx";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      ...(search.trim() && { search: search.trim() }),
      ...(category && { category }),
    }),
    [page, search, category],
  );

  const {
    products,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    createProduct,
    isCreating,
    updateProduct,
    isUpdating,
    deleteProduct,
    isDeleting,
  } = useProducts(params);

  const {
    categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (formData) => {
    if (selectedProduct) {
      await updateProduct({
        productId: selectedProduct._id,
        formData,
      });
    } else {
      await createProduct(formData);
    }
  };

  const handleDeactivate = async (productId) => {
  const confirmed = window.confirm(
    "Deactivate this product? It will no longer appear in the active product listing.",
  );

  if (!confirmed) return;

  setDeleteProductId(productId);

  try {
    await deleteProduct(productId);
  } catch (error) {
    window.alert(
      error?.response?.data?.message ??
        "Unable to deactivate product. Please try again.",
    );
  } finally {
    setDeleteProductId(null);
  }
};

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <section className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalogue and inventory.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {/* Search and category filters */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_240px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
          disabled={categoriesLoading || categoriesError}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {categoriesError && (
        <p className="text-sm text-red-600">
          Unable to load categories. Please refresh and try again.
        </p>
      )}

      {/* Product list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading products...
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-sm text-red-600">
            {error?.response?.data?.message ??
              "Unable to load products. Please try again."}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center">
            <Package size={36} className="text-gray-300" />
            <h2 className="mt-3 font-semibold text-gray-800">
              No products found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-400">
                                <Package size={20} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-60 truncate font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.images?.length ?? 0} images
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {product.category?.name ?? "—"}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.stock > 0
                              ? "text-gray-700"
                              : "font-medium text-red-600"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            aria-label={`Edit ${product.name}`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeactivate(product._id)}
                            disabled={
                              isDeleting &&
                              deleteProductId === product._id
                            }
                            aria-label={`Deactivate ${product.name}`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Total products: {total}
              </p>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {page} of {Math.max(1, totalPages)}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || totalPages === 0}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={selectedProduct ? isUpdating : isCreating}
      />
    </section>
  );
};

export default Products;
