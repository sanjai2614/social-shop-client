import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Tags } from "lucide-react";

import useCategories from "../../hooks/useCategories.js";
import CategoryFormModal from "../../components/categories/categoryFormModal.jsx";
import Button from "../../components/common/Button.jsx";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    categories,
    isLoading,
    isError,
    error,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
  } = useCategories();

  const filteredCategories = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return categories.filter((category) =>
      `${category.name} ${category.slug} ${category.description ?? ""}`
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [categories, search]);

  const limit = 10;
  const totalPages = Math.ceil(filteredCategories.length / limit);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * limit,
    page * limit
  );

  const openCreateModal = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (payload) => {
    if (selectedCategory) {
      await updateCategory({
        categoryId: selectedCategory._id,
        payload,
      });
    } else {
      await createCategory(payload);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete or deactivate "${category.name}"? Categories linked to products will be deactivated.`
    );

    if (!confirmed) return;

    try {
      const response = await deleteCategory(category._id);

      window.alert(
        response?.message ?? "Category action completed successfully."
      );
    } catch (deleteError) {
      window.alert(
        deleteError?.response?.data?.message ??
          "Unable to delete category. Please try again."
      );
    }
  };

  return (
    <section className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product categories.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      <div className="relative rounded-xl border border-gray-200 bg-white p-4">
        <Search
          size={18}
          className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search categories..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <p className="p-12 text-center text-sm text-gray-500">
            Loading categories...
          </p>
        ) : isError ? (
          <p className="p-12 text-center text-sm text-red-600">
            {error?.response?.data?.message ??
              "Unable to load categories. Please try again."}
          </p>
        ) : paginatedCategories.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center">
            <Tags size={36} className="text-gray-300" />
            <h2 className="mt-3 font-semibold text-gray-800">
              No categories found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a category or try another search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {category.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {category.slug}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {category.description || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          aria-label={`Edit ${category.name}`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={isDeleting}
                          aria-label={`Delete ${category.name}`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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
        )}

        {!isLoading && !isError && filteredCategories.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Total categories: {filteredCategories.length}
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
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        category={selectedCategory}
        onSubmit={handleSubmit}
        isSubmitting={selectedCategory ? isUpdating : isCreating}
      />
    </section>
  );
};

export default Categories;