import { useEffect, useState } from "react";

import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";

const CategoryFormModal = ({
  isOpen,
  onClose,
  category = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  const isEditMode = Boolean(category);

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      name: category?.name ?? "",
      description: category?.description ?? "",
    });

    setError("");
  }, [isOpen, category]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    if (payload.name.length < 2 || payload.name.length > 50) {
      setError("Category name must contain 2–50 characters.");
      return;
    }

    if (payload.description.length > 300) {
      setError("Description cannot exceed 300 characters.");
      return;
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ??
          "Unable to save category. Please try again."
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Category" : "Create Category"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="category-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>

          <input
            id="category-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            minLength={2}
            maxLength={50}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="e.g. Electronics"
          />
        </div>

        <div>
          <label
            htmlFor="category-description"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="category-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={300}
            rows={4}
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Describe this category (optional)"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            {isEditMode ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;