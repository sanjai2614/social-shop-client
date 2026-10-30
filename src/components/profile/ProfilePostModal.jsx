
import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import useProducts from "../../hooks/useProducts.js";

const ProfilePostModal = ({
  post,
  isOwnProfile,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableImages, setEditableImages] = useState([]);
  const [content, setContent] = useState("");
  const [taggedProducts, setTaggedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts({
    page: 1,
    limit: 50,
    search: productSearch,
  });


  useEffect(() => {
    setContent(post?.content ?? "");
    setEditableImages(Array.isArray(post?.images) ? [...post.images] : []);
    setTaggedProducts(
      Array.isArray(post?.taggedProducts)
        ? post.taggedProducts.map((product) =>
            typeof product === "string" ? product : product._id
          )
        : []
    );
    setError("");
    setIsEditing(false);
  }, [post]);

  useEffect(() => {
    if (!post) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [post, onClose]);

  
  const images = isEditing
  ? editableImages
  : Array.isArray(post?.images)
  ? post.images
  : [];
  
  if (!post) return null;

  const getImageUrl = (image) =>
    typeof image === "string" ? image : image?.url;

  const toggleProduct = (productId) => {
    setTaggedProducts((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : previous.length >= 10
          ? previous
          : [...previous, productId]
    );
  };

  const handleRemoveImage = (indexToRemove) => {
  setEditableImages((previous) =>
    previous.filter((_, index) => index !== indexToRemove)
  );
};

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");

if (!content.trim() && editableImages.length === 0) {
  setError("Post-la content illa image-aavadhu irukkanum.");
  return;
}

setIsSaving(true);

try {
  await onUpdate(post._id ?? post.id, {
    content: content.trim(),
    taggedProducts,
    images: editableImages.map(getImageUrl).filter(Boolean),
  });

  setIsEditing(false);
} catch (err) {
  setError(
    err?.response?.data?.message ||
      err?.message ||
      "Post update panna mudiyala."
  );
} finally {
  setIsSaving(false);
}
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Indha post-ai permanently delete pannava?"
    );

    if (!confirmed) return;

    setError("");
    setIsDeleting(true);

    try {
      await onDelete(post._id);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Post delete panna mudiyala."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedProductDetails = taggedProducts.map((id) =>
    products.find((product) => product._id === id) ||
    (Array.isArray(post.taggedProducts)
      ? post.taggedProducts.find(
          (product) =>
            typeof product !== "string" && product._id === id
        )
      : null)
  ).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-post-title"
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3">
          <h2 id="profile-post-title" className="font-semibold">
            {isEditing ? "Edit Post" : "Post"}
          </h2>

          <div className="flex items-center gap-1">
            {isOwnProfile && !isEditing && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu((value) => !value)}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="Post options"
                >
                  <MoreHorizontal size={22} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-xl border bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setIsEditing(true);
                        setError("");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      <Pencil size={16} />
                      Edit Post
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isDeleting}
              className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Close post"
            >
              <X size={21} />
            </button>
          </div>
        </header>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <ImageIcon size={20} />
              </div>
            )}

            <div>
              <p className="font-semibold text-gray-900">
                {post.author?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>

          {images.length > 0 && (
  <div className="space-y-3">
    {isEditing && (
      <p className="text-sm font-medium text-gray-700">
        Post Images ({editableImages.length})
      </p>
    )}

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image, index) => {
        const imageUrl = getImageUrl(image);

        if (!imageUrl) return null;

        return (
          <div
            key={`${imageUrl}-${index}`}
            className="relative overflow-hidden rounded-xl border border-gray-200"
          >
            <img
              src={imageUrl}
              alt={`Post image ${index + 1}`}
              className="h-40 w-full bg-gray-50 object-cover sm:h-48"
            />

            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={isSaving}
                aria-label={`Remove image ${index + 1}`}
                title="Remove image"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow transition hover:bg-red-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label
                  htmlFor="edit-post-caption"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Caption
                </label>

                <textarea
                  id="edit-post-caption"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Write a caption..."
                  className="w-full resize-y rounded-xl border border-gray-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {content.length}/2000
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">
                    Tagged Products
                  </h3>
                </div>

                <input
                  type="search"
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border p-3 outline-none focus:border-indigo-500"
                />

                {taggedProducts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">
                      Selected products ({taggedProducts.length}/10)
                    </p>

                    {selectedProductDetails.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between rounded-lg bg-indigo-50 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          {product.price != null && (
                            <p className="text-xs text-gray-600">
                              ₹{product.price}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleProduct(product._id)}
                          className="ml-2 rounded-lg p-2 text-red-600 hover:bg-red-100"
                          aria-label={`Remove ${product.name}`}
                        >
                          <X size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {isProductsLoading && (
                  <p className="text-sm text-gray-500">
                    Loading products...
                  </p>
                )}

                {isProductsError && (
                  <p className="text-sm text-red-600">
                    Products load aagala. Try again.
                  </p>
                )}

                {!isProductsLoading &&
                  !isProductsError &&
                  products.map((product) => {
                    const selected = taggedProducts.includes(product._id);

                    return (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => toggleProduct(product._id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                          selected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {product.images?.[0] ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            <ImageIcon size={20} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          {product.price != null && (
                            <p className="text-xs text-gray-500">
                              ₹{product.price}
                            </p>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-indigo-600">
                          {selected ? "Selected ✓" : "Select +"}
                        </span>
                      </button>
                    );
                  })}
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => {
  setIsEditing(false);
  setContent(post.content ?? "");
  setEditableImages(Array.isArray(post.images) ? [...post.images] : []);
  setTaggedProducts(
    (post.taggedProducts ?? [])
      .map((product) =>
        typeof product === "string" ? product : product._id
      )
      .filter(Boolean)
  );
  setError("");
}}
                  disabled={isSaving}
                  className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {post.content && (
                <p className="whitespace-pre-wrap wrap-break-words text-gray-800">
                  {post.content}
                </p>
              )}

              {Array.isArray(post.taggedProducts) &&
                post.taggedProducts.length > 0 && (
                  <section className="space-y-3 border-t pt-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Tag size={17} className="text-indigo-600" />
                      Tagged Products
                    </h3>

                    {post.taggedProducts.map((product, index) => {
                      if (typeof product === "string") {
                        return (
                          <p key={product} className="text-sm text-gray-500">
                            Product details load aagala.
                          </p>
                        );
                      }

                      return (
                        <div
                          key={product._id ?? index}
                          className="flex items-center gap-3 rounded-xl border p-3"
                        >
                          {product.images?.[0] && (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name || "Product"}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          )}

                          <div>
                            <p className="text-sm font-medium">
                              {product.name || "Product"}
                            </p>
                            {product.price != null && (
                              <p className="mt-1 font-semibold">
                                ₹{product.price}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                )}

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePostModal;
