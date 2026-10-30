
import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const ProductFormModal = ({
  isOpen,
  onClose,
  product = null,
  categories = [],
  onSubmit,
  isSubmitting = false,
}) => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      product
        ? {
            name: product.name ?? "",
            description: product.description ?? "",
            price: String(product.price ?? ""),
            category:
              typeof product.category === "object"
                ? product.category?._id ?? ""
                : product.category ?? "",
            stock: String(product.stock ?? ""),
          }
        : initialForm,
    );

    setExistingImages(product?.images ?? []);
    setSelectedFiles([]);
    setError("");
  }, [isOpen, product]);

  // Clean up temporary image preview URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) =>
        URL.revokeObjectURL(item.preview),
      );
    };
  }, [selectedFiles]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) return;

    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(
          file.type,
        ) || file.size > MAX_FILE_SIZE,
    );

    if (invalidFile) {
      setError(
        "JPG, PNG, WebP images only. Each image must be 5 MB or less.",
      );
      return;
    }

    if (
      existingImages.length + selectedFiles.length + files.length >
      MAX_IMAGES
    ) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    setError("");

    setSelectedFiles((previous) => [
      ...previous,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages((previous) =>
      previous.filter((image) => image !== imageUrl),
    );
  };

  const removeSelectedFile = (preview) => {
    setSelectedFiles((previous) =>
      previous.filter((item) => item.preview !== preview),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("Product name and description are required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      setError("Price must be greater than zero.");
      return;
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError("Stock must be a whole number greater than or equal to zero.");
      return;
    }

    if (existingImages.length + selectedFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("price", String(Number(form.price)));
    formData.append("category", form.category);
    formData.append("stock", String(Number(form.stock)));

    if (isEditMode) {
      formData.append(
        "existingImages",
        JSON.stringify(existingImages),
      );
    }

    selectedFiles.forEach(({ file }) => {
      formData.append("images", file);
    });

    console.log("Selected files:", selectedFiles);

for (const [key, value] of formData.entries()) {
  console.log(
    key,
    value instanceof File
      ? {
          name: value.name,
          type: value.type,
          size: value.size,
        }
      : value
  );
}

    try {
      await onSubmit(formData);
      onClose();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ??
          "Unable to save product. Please try again.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Product" : "Add Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={120}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter product name"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={2000}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Describe the product"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="499"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="25"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Product Images
            </label>
            <span className="text-xs text-gray-500">
              {existingImages.length + selectedFiles.length}/{MAX_IMAGES}
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={handleFiles}
          />

          <button
            type="button"
            disabled={
              existingImages.length + selectedFiles.length >= MAX_IMAGES
            }
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-5 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ImagePlus size={20} />
            Choose images (JPG, PNG, WebP; max 5 MB each)
          </button>

          {(existingImages.length > 0 || selectedFiles.length > 0) && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {existingImages.map((image) => (
                <div
                  key={image}
                  className="relative overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={image}
                    alt="Existing product"
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image)}
                    aria-label="Remove existing image"
                    className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-600 shadow hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {selectedFiles.map((item) => (
                <div
                  key={item.preview}
                  className="relative overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(item.preview)}
                    aria-label="Remove selected image"
                    className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-600 shadow hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            {isEditMode ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
